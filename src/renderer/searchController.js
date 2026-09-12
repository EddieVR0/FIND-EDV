import { clearResults, renderResults, showEmptyState } from './resultsView.js';

/** Abre el archivo elegido y actualiza el estado visible. */
async function openFile(filePath, status) {
  status.textContent = 'Abriendo archivo...';
  const result = await window.finderAPI.openFile(filePath);
  status.textContent = result?.ok ? 'Archivo abierto' : 'No se pudo abrir el archivo';
}

/** Ejecuta una búsqueda y muestra sus resultados en pantalla. */
async function searchFiles(query, status, resultsList) {
  const term = query.trim();
  if (!term) {
    clearResults(resultsList);
    status.textContent = 'Busca en Escritorio, Documentos y Descargas';
    return;
  }
  try {
    status.textContent = 'Buscando en tus carpetas personales...';
    const response = await window.finderAPI.searchFiles({ query: term, maxResults: 30 });
    const items = Array.isArray(response?.items) ? response.items : [];
    renderResults(resultsList, items, (filePath) => openFile(filePath, status));
    status.textContent = items.length ? `${items.length} resultado${items.length === 1 ? '' : 's'} · selecciona uno para abrirlo` : 'Sin resultados';
  } catch (error) {
    console.error('Falló la búsqueda', error);
    showEmptyState(resultsList, 'No se pudo realizar la búsqueda');
    status.textContent = 'Error al buscar';
  }
}

/** Crea los manejadores de escritura y teclado para la barra de búsqueda. */
export function createSearchController(input, status, resultsList) {
  let timer;
  const runSearch = () => searchFiles(input.value, status, resultsList);
  return {
    scheduleSearch() { clearTimeout(timer); timer = setTimeout(runSearch, 180); },
    handleKeyboard(event) {
      if (event.key === 'Escape') { input.value = ''; runSearch(); }
      if (event.key === 'Enter') runSearch();
    }
  };
}
