import { createSearchController } from './searchController.js';

/** Inicializa los controles de la interfaz del buscador. */
function initializeApp() {
  const input = document.getElementById('searchInput');
  const status = document.getElementById('statusText');
  if (!window.finderAPI) {
    status.textContent = 'No hay acceso al sistema de archivos';
    return;
  }
  const controller = createSearchController(input, status, document.getElementById('resultsList'));
  input.addEventListener('input', controller.scheduleSearch);
  input.addEventListener('keydown', controller.handleKeyboard);
  document.getElementById('closeButton').addEventListener('click', () => window.finderAPI.closeApp());
  input.focus();
}

initializeApp();
