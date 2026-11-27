import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const PRIORITY_LABEL = { high: '高', medium: '中', low: '低', none: 'なし' }
const PRIORITY_CLASS = {
  high:   'priority-high',
  medium: 'priority-medium',
  low:    'priority-low',
  none:   'priority-none',
}

function dueClass(due, columnId) {
  if (!due) return ''
  if (columnId === 'done') return 'done-col'
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const d = new Date(due)
  if (d < today) return 'overdue'
  if ((d - today) / 86400000 <= 2) return 'due-soon'
  return ''
}

function dueLabel(due) {
  if (!due) return '期限なし'
  const d = new Date(due)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export default function Card({ card, columnId, onDelete, onPriorityChange, onDueChange, onTitleUpdate }) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(card.text)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  const dc = dueClass(card.due, columnId)
  const priority = card.priority || 'none'

  function commitEdit() {
    const trimmed = editText.trim()
    if (trimmed && trimmed !== card.text) {
      onTitleUpdate(card.id, columnId, trimmed)
    } else {
      setEditText(card.text)
    }
    setEditing(false)
  }

  function handleEditKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit() }
    if (e.key === 'Escape') { setEditText(card.text); setEditing(false) }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="card"
    >
      {editing ? (
        <textarea
          className="card-title-input"
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={handleEditKeyDown}
          onPointerDown={e => e.stopPropagation()}
          autoFocus
          rows={2}
        />
      ) : (
        <div
          className="card-text"
          onDoubleClick={e => { e.stopPropagation(); setEditing(true); setEditText(card.text) }}
          title="ダブルクリックで編集"
        >
          {card.text}
        </div>
      )}
      <div className="card-meta">
        <div className="card-meta-left">
          <button
            data-popup-anchor={`${card.id}-priority`}
            className={`priority-badge ${PRIORITY_CLASS[priority]}`}
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onPriorityChange(card.id, columnId) }}
          >
            優先度: {PRIORITY_LABEL[priority]}
          </button>
          <button
            data-popup-anchor={`${card.id}-due`}
            className={`due-badge ${dc}`}
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onDueChange(card.id, columnId) }}
          >
            📅 {dueLabel(card.due)}
          </button>
        </div>
        <button
          className="btn-delete"
          onPointerDown={e => e.stopPropagation()}
          onClick={e => { e.stopPropagation(); onDelete(card.id, columnId) }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
