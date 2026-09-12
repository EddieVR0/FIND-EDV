const fs = require('fs');
const path = require('path');
const { getFileType, normalize, scoreResult } = require('./fileMatcher');
const { INCLUDE_FOLDERS, SEARCHABLE_EXTENSIONS } = require('../config/searchConfig');

// Estos formatos aparecen primero en los resultados de búsqueda.
const IMPORTANT_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'ico',
  'mp4', 'mov', 'avi', 'mkv', 'webm',
  'mp3', 'wav', 'flac', 'aac', 'ogg',
  'pdf', 'doc', 'docx', 'txt', 'ttf', 'otf'
]);

/** Recorre carpetas y devuelve coincidencias de archivos y carpetas ordenadas por relevancia. */
class FileSearchService {
  /** Configura el número de candidatos conservados antes de ordenar el resultado final. */
  constructor() {
    this.candidateMultiplier = 10;
  }

  /** Busca un término sin distinguir mayúsculas desde una o varias rutas. */
  async search(rootPaths, query = '', maxResults = 50) {
    const term = normalize(query.trim());
    if (!term) return { rootPaths, total: 0, items: [] };

    const queue = [...new Set(Array.isArray(rootPaths) ? rootPaths : [rootPaths])];
    let queueIndex = 0;
    const seen = new Set();
    const folderResults = [];
    const fileResults = [];
    const candidateLimit = maxResults * this.candidateMultiplier;

    while (queueIndex < queue.length) {
      const currentPath = queue[queueIndex++];
      if (!currentPath || seen.has(currentPath)) continue;
      seen.add(currentPath);

      let entries;
      try {
        entries = await fs.promises.readdir(currentPath, { withFileTypes: true });
      } catch (_error) {
        continue;
      }

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);
        if (entry.isSymbolicLink()) continue;
        if (entry.isDirectory()) {
          queue.push(fullPath);
          if (INCLUDE_FOLDERS && normalize(entry.name).includes(term) && folderResults.length < maxResults) {
            folderResults.push({
              id: fullPath,
              name: entry.name,
              extension: '',
              type: 'Carpeta',
              path: fullPath,
              isImportant: false,
              score: scoreResult(entry.name, term)
            });
          }
          continue;
        }
        const extension = path.extname(entry.name).slice(1).toLowerCase();
        if (!entry.isFile() || !SEARCHABLE_EXTENSIONS.has(extension) || !normalize(entry.name).includes(term) || fileResults.length >= candidateLimit) continue;
        fileResults.push({
          id: fullPath,
          name: entry.name,
          extension,
          type: getFileType(entry.name),
          path: fullPath,
          isImportant: IMPORTANT_EXTENSIONS.has(extension),
          score: scoreResult(entry.name, term)
        });
      }
    }

    const sortedFolders = folderResults
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    const remainingSlots = Math.max(0, maxResults - sortedFolders.length);
    const sortedFiles = fileResults
      .sort((a, b) => Number(b.isImportant) - Number(a.isImportant) || b.score - a.score || a.name.localeCompare(b.name))
      .slice(0, remainingSlots)
      .map(({ isImportant, score, ...item }) => item);
    const items = [...sortedFolders, ...sortedFiles]
      .map(({ isImportant, score, ...item }) => item);

    return { rootPaths, total: items.length, items };
  }
}

module.exports = { FileSearchService };
