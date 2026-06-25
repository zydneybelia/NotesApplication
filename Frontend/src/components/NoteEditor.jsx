import React from 'react'

export default function NoteEditor({ note, onChange, onDelete }) {
  if (!note) {
    return <div className="no-selection">Select or create a note to begin.</div>
  }

  return (
    <div className="note-editor">
      <div className="editor-header">
        <input
          className="note-title-input"
          value={note.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Title"
        />
        <button className="delete-note" onClick={onDelete} title="Delete note">Delete</button>
      </div>
      <textarea
        className="note-body"
        value={note.body}
        onChange={(e) => onChange({ body: e.target.value })}
        placeholder="Write your note here..."
      />
    </div>
  )
}
