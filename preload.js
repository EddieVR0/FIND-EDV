const { contextBridge, ipcRenderer } = require('electron');

/** Solicita una búsqueda de archivos a la unidad C:. */
function buscarArchivos(payload) {
  return ipcRenderer.invoke('search-files', payload);
}

/** Abre un archivo con la aplicación predeterminada del sistema. */
function abrirArchivo(filePath) {
  return ipcRenderer.invoke('open-file', filePath);
}

/** Cierra la ventana principal de la aplicación. */
function cerrarAplicacion() {
  return ipcRenderer.invoke('close-app');
}

/** Muestra un archivo seleccionado dentro del Explorador de Windows. */
function mostrarUbicacionDelArchivo(filePath) {
  return ipcRenderer.invoke('show-file-in-folder', filePath);
}

contextBridge.exposeInMainWorld('finderAPI', {
  searchFiles: buscarArchivos,
  openFile: abrirArchivo,
  closeApp: cerrarAplicacion,
  showFileInFolder: mostrarUbicacionDelArchivo
});
