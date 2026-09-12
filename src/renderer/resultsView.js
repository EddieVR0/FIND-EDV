import { createFileResultItem } from './fileResultItem.js';

/** Elimina los resultados que están actualmente en la lista. */
export function clearResults(resultsList) {
  resultsList.replaceChildren();
}

/** Muestra un mensaje cuando no hay archivos para presentar. */
export function showEmptyState(resultsList, message) {
  clearResults(resultsList);
  const item = document.createElement('li');
  item.className = 'empty-state';
  item.textContent = message;
  resultsList.append(item);
}

/** Construye la lista de resultados que el usuario puede abrir. */
export function renderResults(resultsList, items, onOpen) {
  if (!items.length) return showEmptyState(resultsList, 'No encontramos archivos con ese nombre');
  clearResults(resultsList);
  items.forEach((item) => resultsList.append(createFileResultItem(item, onOpen)));
}
