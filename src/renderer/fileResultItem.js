/** Devuelve la variante visual del icono para un tipo de archivo. */
function iconFor(type) {
  return { Carpeta: 'folder', Imagen: 'image', Video: 'video', Audio: 'audio', Tipografía: 'font', Documento: 'document' }[type] || 'file';
}

/** Crea una fila accesible que abre el archivo al activarse. */
export function createFileResultItem(item, onOpen) {
  const row = document.createElement('li');
  row.className = 'result-item';
  row.tabIndex = 0;
  row.setAttribute('role', 'button');
  row.setAttribute('aria-label', `Abrir ${item.name}`);
  const icon = document.createElement('span');
  icon.className = `file-icon ${iconFor(item.type)}`;
  const details = document.createElement('div');
  details.className = 'file-details';
  const name = document.createElement('span');
  name.className = 'file-name';
  name.textContent = item.name;
  const filePath = document.createElement('span');
  filePath.className = 'file-path';
  filePath.textContent = item.path;
  details.append(name, filePath);
  const type = document.createElement('span');
  type.className = 'file-type';
  type.textContent = item.type;

  const locationButton = document.createElement('button');
  locationButton.className = 'location-button';
  locationButton.type = 'button';
  const isFolder = item.type === 'Carpeta';
  locationButton.textContent = isFolder ? 'Abrir carpeta' : 'Ver ubicación';
  locationButton.setAttribute('aria-label', `${locationButton.textContent} de ${item.name}`);
  locationButton.addEventListener('click', (event) => {
    event.stopPropagation();
    if (isFolder) window.finderAPI.openFile(item.path);
    else window.finderAPI.showFileInFolder(item.path);
  });

  row.append(icon, details, type, locationButton);
  row.addEventListener('click', () => onOpen(item.path));
  row.addEventListener('keydown', (event) => {
    if (event.target !== row) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen(item.path);
    }
  });
  return row;
}
