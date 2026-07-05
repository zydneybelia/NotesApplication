export default function NoteEditor({ note, onChange, onDelete }) {
  if (!note) {
    return (
      <div className="notes-editor-empty">
        <p>Select or create a note to get started.</p>
      </div>
    )
  }

  return (
    <>
      <div className="notes-editor-toolbar">
        <span className="notes-editor-meta">
          {note.edited_at ? `Edited ${new Date(note.edited_at).toLocaleDateString()}` : ''}
        </span>
        <div className="notes-editor-actions">
          <button className="notes-icon-btn" onClick={onDelete} title="Delete note">🗑</button>
        </div>
      </div>

      <div className="notes-editor-body">
        <input
          type="text"
          className="notes-editor-title"
          value={note.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Title"
        />
        <textarea
          className="notes-editor-content"
          value={note.content || ''}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="Start writing..."
        />
      </div>
    </>
  )
}