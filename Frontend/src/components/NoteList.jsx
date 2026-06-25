import React from 'react'

export default function NoteList({ notes, onSelect, onDelete, activeId }) {
  return (
    <div className="note-list">
      {notes.length === 0 && <div className="empty">No notes yet</div>}
      <ul>
        {notes.map((n) => (
          <li
            key={n.id}
            className={"note-item" + (n.id === activeId ? ' active' : '')}
            onClick={() => onSelect(n.id)}
          >
            <div className="note-title">{n.title || 'Untitled'}</div>
            <div className="note-snippet">{(n.body || '').slice(0, 80)}</div>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(n.id)
              }}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
