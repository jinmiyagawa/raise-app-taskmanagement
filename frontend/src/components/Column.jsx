import { useState } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import Card from './Card'

const PRIORITY_OPTIONS = [
  { value: 'none',   label: '⬜ なし' },
  { value: 'low',    label: '🟢 低' },
  { value: 'medium', label: '🟡 中' },
  { value: 'high',   label: '🔴 高' },
]

export default function Column({ column, onAddCard, onDeleteCard, onPriorityChange, onDueChange, onTitleUpdate }) {
  const [formOpen, setFormOpen] = useState(false)
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('none')
  const [due, setDue] = useState('')

  const { setNodeRef } = useDroppable({ id: column.id })

  function handleAdd() {
    const trimmed = text.trim()
    if (!trimmed) return
    onAddCard(column.id, trimmed, priority, due || null)
    setText('')
    setPriority('none')
    setDue('')
    setFormOpen(false)
  }

  function handleCancel() {
    setFormOpen(false)
    setText('')
    setPriority('none')
    setDue('')
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') handleCancel()
  }

  return (
    <div className="column">
      <div className="column-header">
        <span className="column-title">{column.title}</span>
        <span className="column-count">{column.cards.length}</span>
      </div>

      <SortableContext items={column.cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="card-list">
          {column.cards.length === 0 && (
            <div className="empty-state">カードがありません</div>
          )}
          {column.cards.map(card => (
            <Card
              key={card.id}
              card={card}
              columnId={column.id}
              onDelete={onDeleteCard}
              onPriorityChange={onPriorityChange}
              onDueChange={onDueChange}
              onTitleUpdate={onTitleUpdate}
            />
          ))}
        </div>
      </SortableContext>

      <div className="add-form">
        {formOpen ? (
          <>
            <textarea
              className="add-textarea"
              rows={3}
              placeholder="カードのタイトルを入力..."
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            <div className="add-form-row">
              <select
                className="add-select"
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                {PRIORITY_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <input
                type="date"
                className="add-date"
                value={due}
                onChange={e => setDue(e.target.value)}
              />
            </div>
            <div className="add-form-controls">
              <button className="btn-add-confirm" onClick={handleAdd}>カードを追加</button>
              <button className="btn-cancel" onClick={handleCancel}>✕</button>
            </div>
          </>
        ) : (
          <button className="btn-add-trigger" onClick={() => setFormOpen(true)}>カードを追加</button>
        )}
      </div>
    </div>
  )
}
