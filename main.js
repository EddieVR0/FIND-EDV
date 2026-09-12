
const { app, BrowserWindow, ipcMain, shell, globalShortcut } = require('electron');

const path = require('path');

const { FileSearchService } = require('./src/services/fileSearchService');

const searchService = new FileSearchService();

/** Crea y muestra la ventana sin marco de la aplicación. */

function createWindow() {

  const mainWindow = new BrowserWindow({

    width: 1200,

    height: 320,

    minWidth: 900,

    minHeight: 460,
// por este frame no muestra la barra de titulo y los botones de minimizar, maximizar y cerrar
    frame: false,

    backgroundColor: '#0f1117',

    titleBarStyle: 'hiddenInset',

    webPreferences: {

      preload: path.join(__dirname, 'preload.js'),

      contextIsolation: true,

      nodeIntegration: false

    }

  });

  mainWindow.loadFile(path.join(__dirname, 'src', 'renderer', 'index.html'));

  return mainWindow;

}

/** Busca archivos en las carpetas personales de Windows y devuelve los resultados encontrados. */

async function handleSearchFiles(_event, payload = {}) {

  const { query = '', maxResults = 50 } = payload;

  const rootPaths = [

    app.getPath('desktop'),

    app.getPath('documents'),

    app.getPath('downloads')

  ];

  return searchService.search(rootPaths, query, maxResults);

}

/** Abre un archivo solicitado por la interfaz con el programa predeterminado. */

async function handleOpenFile(_event, filePath) {

  if (!filePath) return { ok: false, error: 'No se indicó un archivo' };

  const error = await shell.openPath(filePath);

  return error ? { ok: false, error } : { ok: true };

}

/** Cierra la ventana desde la que se solicitó la acción. */

function handleCloseApp(event) {

  BrowserWindow.fromWebContents(event.sender)?.close();

}

/** Abre el Explorador de Windows y selecciona el archivo solicitado. */

function handleShowFileInFolder(_event, filePath) {

  if (!filePath) return { ok: false, error: 'No se indicó un archivo' };

  shell.showItemInFolder(filePath);

  return { ok: true };

}

/** Registra los canales privados que comunica la interfaz con Electron. */

function registerIpcHandlers() {

  ipcMain.handle('search-files', handleSearchFiles);

  ipcMain.handle('open-file', handleOpenFile);

  ipcMain.handle('close-app', handleCloseApp);

  ipcMain.handle('show-file-in-folder', handleShowFileInFolder);

}

/** Inicia la aplicación cuando Electron está listo. */

function initializeApplication() {

  registerIpcHandlers();

  createWindow();

}

/** Restaura una ventana al reactivar la aplicación. */

function restoreWindow() {

  if (BrowserWindow.getAllWindows().length === 0) createWindow();

}

/** Finaliza la aplicación cuando se cierra su última ventana en Windows o Linux. */

function quitWhenAllWindowsClosed() {

  if (process.platform !== 'darwin') app.quit();

}
// inicializacioonn

app.whenReady().then(() => {

  initializeApplication();

  registerGlobalShortcut();

});


/**
 * Libera el atajo global cuando Electron va a cerrarse.
 */
app.on('will-quit', () => {

  globalShortcut.unregisterAll();

});


app.on('activate', restoreWindow);

app.on('window-all-closed', quitWhenAllWindowsClosed);
