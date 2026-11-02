const BASE = '/api';

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status}: ${text}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const fetchColumns = () =>
  fetch(`${BASE}/columns`).then(handleResponse);

export const createCard = (columnId, text) =>
  fetch(`${BASE}/columns/${columnId}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  }).then(handleResponse);

export const deleteCard = (cardId) =>
  fetch(`${BASE}/cards/${cardId}`, { method: 'DELETE' }).then(handleResponse);

export const updateCard = (cardId, updates) =>
  fetch(`${BASE}/cards/${cardId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  }).then(handleResponse);

export const moveCard = (cardId, targetColumnId, afterCardId) =>
  fetch(`${BASE}/cards/${cardId}/move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetColumnId, afterCardId: afterCardId ?? null }),
  }).then(handleResponse);
