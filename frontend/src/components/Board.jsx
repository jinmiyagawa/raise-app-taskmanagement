import { useState, useEffect } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './Column'

const API = 'http://localhost:8080/api'

const PRIORITY_LABEL = { high: '🔴 高', medium: '🟡 中', low: '🟢 低', none: '⬜ なし' }

export default function Board() {
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCard, setActiveCard] = useState(null) // ドラッグ中のカード情報

  const [priorityPopup, setPriorityPopup] = useState(null)
  const [datePopup, setDatePopup] = useState(null)
  const [dateInput, setDateInput] = useState('')

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => {
    fetch(`${API}/columns`)
      .then(r => r.json())
      .then(data => { setColumns(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    function close() { setPriorityPopup(null); setDatePopup(null) }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  // ── Add card ─────────────────────────────────────────
  async function handleAddCard(columnId, text, priority = 'none', due = null) {
    const res = await fetch(`${API}/columns/${columnId}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, priority, due }),
    })
    const newCard = await res.json()
    setColumns(cols => cols.map(col =>
      col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col
    ))
  }

  // ── Delete card ──────────────────────────────────────
  async function handleDeleteCard(cardId, columnId) {
    await fetch(`${API}/cards/${cardId}`, { method: 'DELETE' })
    setColumns(cols => cols.map(col =>
      col.id === columnId ? { ...col, cards: col.cards.filter(c => c.id !== cardId) } : col
    ))
  }

  // ── Title update ─────────────────────────────────────
  async function handleTitleUpdate(cardId, columnId, text) {
    const res = await fetch(`${API}/cards/${cardId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    const updated = await res.json()
    setColumns(cols => cols.map(col =>
      col.id === columnId
        ? { ...col, cards: col.cards.map(c => c.id === cardId ? updated : c) }
        : col
    ))
  }

  // ── Priority ─────────────────────────────────────────
  function handlePriorityChange(cardId, columnId) {
    const btn = document.querySelector(`[data-popup-anchor="${cardId}-priority"]`)
    const rect = btn ? btn.getBoundingClientRect() : { bottom: 100, left: 100 }
    setPriorityPopup({ cardId, columnId, rect })
    setDatePopup(null)
  }

  async function applyPriority(priority) {
    const { cardId, columnId } = priorityPopup
    const res = await fetch(`${API}/cards/${cardId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priority }),
    })
    const updated = await res.json()
    setColumns(cols => cols.map(col =>
      col.id === columnId
        ? { ...col, cards: col.cards.map(c => c.id === cardId ? updated : c) }
        : col
    ))
    setPriorityPopup(null)
  }

  // ── Due date ─────────────────────────────────────────
  function handleDueChange(cardId, columnId) {
    const col = columns.find(c => c.id === columnId)
    const card = col?.cards.find(c => c.id === cardId)
    const btn = document.querySelector(`[data-popup-anchor="${cardId}-due"]`)
    const rect = btn ? btn.getBoundingClientRect() : { bottom: 100, left: 100 }
    setDateInput(card?.due ?? '')
    setDatePopup({ cardId, columnId, rect })
    setPriorityPopup(null)
  }

  async function applyDue(due) {
    const { cardId, columnId } = datePopup
    const res = await fetch(`${API}/cards/${cardId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ due: due || null }),
    })
    const updated = await res.json()
    setColumns(cols => cols.map(col =>
      col.id === columnId
        ? { ...col, cards: col.cards.map(c => c.id === cardId ? updated : c) }
        : col
    ))
    setDatePopup(null)
  }

  // ── Drag & Drop ──────────────────────────────────────
  function handleDragStart(event) {
    const { active } = event
    const sourceCol = columns.find(col => col.cards.some(c => c.id === active.id))
    const card = sourceCol?.cards.find(c => c.id === active.id)
    if (card) setActiveCard({ card, columnId: sourceCol.id })
  }

  async function handleDragEnd(event) {
    setActiveCard(null)
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId   = over.id

    const sourceCol = columns.find(col => col.cards.some(c => c.id === activeId))
    if (!sourceCol) return

    const targetCol = columns.find(col => col.id === overId)
      ?? columns.find(col => col.cards.some(c => c.id === overId))
    if (!targetCol) return

    if (sourceCol.id === targetCol.id) {
      const oldIndex = sourceCol.cards.findIndex(c => c.id === activeId)
      const newIndex = sourceCol.cards.findIndex(c => c.id === overId)
      if (oldIndex === newIndex) return
      const reordered = arrayMove(sourceCol.cards, oldIndex, newIndex)
      setColumns(cols => cols.map(col =>
        col.id === sourceCol.id ? { ...col, cards: reordered } : col
      ))
      await fetch(`${API}/cards/${activeId}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetColumnId: targetCol.id, position: newIndex }),
      })
    } else {
      const card = sourceCol.cards.find(c => c.id === activeId)
      setColumns(cols => cols.map(col => {
        if (col.id === sourceCol.id) return { ...col, cards: col.cards.filter(c => c.id !== activeId) }
        if (col.id === targetCol.id) return { ...col, cards: [...col.cards, card] }
        return col
      }))
      await fetch(`${API}/cards/${activeId}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetColumnId: targetCol.id, position: targetCol.cards.length }),
      })
    }
  }

  if (loading) return <div style={{ color: '#fff', padding: 20 }}>読み込み中...</div>

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <main className="board">
          {columns.map(col => (
            <Column
              key={col.id}
              column={col}
              onAddCard={handleAddCard}
              onDeleteCard={handleDeleteCard}
              onPriorityChange={handlePriorityChange}
              onDueChange={handleDueChange}
              onTitleUpdate={handleTitleUpdate}
            />
          ))}
        </main>

        <DragOverlay>
          {activeCard && (
            <div className="card-drag-overlay">
              <div className="card-text">{activeCard.card.text}</div>
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Priority popup */}
      {priorityPopup && (
        <div
          className="popup open"
          style={{ top: priorityPopup.rect.bottom + 4, left: priorityPopup.rect.left }}
          onClick={e => e.stopPropagation()}
        >
          <div className="popup-title">優先度</div>
          {Object.entries(PRIORITY_LABEL).map(([key, label]) => (
            <button key={key} className="popup-item" onClick={() => applyPriority(key)}>{label}</button>
          ))}
        </div>
      )}

      {/* Date popup */}
      {datePopup && (
        <div
          className="date-popup open"
          style={{ top: datePopup.rect.bottom + 4, left: datePopup.rect.left }}
          onClick={e => e.stopPropagation()}
        >
          <label>期限日</label>
          <input type="date" value={dateInput} onChange={e => setDateInput(e.target.value)} />
          <div className="date-popup-actions">
            <button className="btn-date-confirm" onClick={() => applyDue(dateInput)}>設定</button>
            <button className="btn-date-clear" onClick={() => applyDue(null)}>削除</button>
          </div>
        </div>
      )}
    </>
  )
}
