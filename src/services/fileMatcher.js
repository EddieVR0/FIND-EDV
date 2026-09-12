const path = require('path');

/** Normaliza texto para comparar nombres sin distinguir mayúsculas ni acentos. */
function normalize(value = '') {
  return String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/** Clasifica un archivo por la extensión de su nombre. */
function getFileType(name) {
  const extension = path.extname(name).toLowerCase().slice(1);
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'svg', 'ico'].includes(extension)) return 'Imagen';
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension)) return 'Video';
  if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(extension)) return 'Audio';
  if (['ttf', 'otf'].includes(extension)) return 'Tipografía';
  if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'md', 'csv'].includes(extension)) return 'Documento';
  return 'Archivo';
}


/** Asigna prioridad a las coincidencias más cercanas al término buscado. */
function scoreResult(name, query) {
  const normalizedName = normalize(name);
  if (normalizedName === query) return 100;
  if (normalizedName.startsWith(query)) return 60;
  if (normalizedName.includes(query)) return 30;
  return 0;
}

module.exports = { getFileType, normalize, scoreResult };
