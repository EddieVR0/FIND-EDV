/**
 * Extensiones que el buscador incluirá. Agrega o elimina valores sin el punto.
 * Ejemplo: para permitir Excel, agrega 'xlsx' y 'xls'.
 */
const SEARCHABLE_EXTENSIONS = new Set([
  'pdf', 'doc', 'docx', 'txt', 'xlsx', 'xls',
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'ico',
  'mp4', 'mov', 'avi', 'mkv', 'webm',
  'mp3', 'wav', 'flac', 'aac', 'ogg',
  'ttf', 'otf'
]);

/** Indica si las carpetas deben aparecer junto con los archivos. */
const INCLUDE_FOLDERS = true;

module.exports = { INCLUDE_FOLDERS, SEARCHABLE_EXTENSIONS };
