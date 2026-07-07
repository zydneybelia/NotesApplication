export default function NoteList({ notes, onSelect, onDelete, activeId }) {
  if (notes.length === 0) {
    return <p className="notes-empty-hint">No notes match your search.</p>
  }

  return (
    <div className="notes-list">
      {notes.map((note) => (
        <button
          key={note.id}
          className={'notes-list-item' + (note.id === activeId ? ' notes-list-item-active' : '')}
          onClick={() => onSelect(note.id)}
        >
          <div className="notes-list-item-heading">
            <p className="notes-list-item-title">{note.title || 'Untitled note'}</p>
            <span className="notes-list-item-meta">
              {note.edited_at ? new Date(note.edited_at).toLocaleDateString() : ''}
            </span>
          </div>
          <p className="notes-list-item-preview">
            {(note.content || '').slice(0, 60)}
          </p>
        </button>
      ))}
    </div>
  )
}