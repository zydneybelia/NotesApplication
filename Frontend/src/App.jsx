import { useState } from 'react'
import './NotesApp.css'

const initialNotes = [
  {
    id: 1,
    title: 'Grocery list',
    preview: 'Milk, eggs, bread, coffee',
    content:
      'Milk, eggs, bread, coffee\nApples, spinach, chicken\nPick up dry cleaning on the way back',
    editedAt: '2 minutes ago',
  },
  {
    id: 2,
    title: 'Project ideas',
    preview: 'Notes app, weather widget...',
    content: 'Notes app, weather widget, habit tracker, recipe organizer.',
    editedAt: '1 hour ago',
  },
  {
    id: 3,
    title: 'Meeting recap',
    preview: 'Discussed backend schema',
    content:
      'Discussed backend schema, decided on Spring Boot + Supabase, next step is auth flow.',
    editedAt: 'Yesterday',
  },
  {
    id: 4,
    title: 'Book recommendations',
    preview: 'Atomic habits, Deep work',
    content: 'Atomic habits, Deep work, The Pragmatic Programmer.',
    editedAt: '3 days ago',
  },
  {
    id: 5,
    title: 'Travel checklist',
    preview: 'Passport, charger, tickets',
    content: 'Passport, charger, tickets, travel adapter, sunscreen.',
    editedAt: 'Last week',
  },
]

export default function NotesApp() {
  const [notes, setNotes] = useState(initialNotes)
  const [activeId, setActiveId] = useState(initialNotes[0].id)
  const [query, setQuery] = useState('')

  const activeNote = notes.find((n) => n.id === activeId)

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(query.toLowerCase()),
  )

  function handleTitleChange(value) {
    setNotes((prev) =>
      prev.map((n) => (n.id === activeId ? { ...n, title: value } : n)),
    )
  }

  function handleContentChange(value) {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeId
          ? { ...n, content: value, preview: value.split('\n')[0] || '' }
          : n,
      ),
    )
  }

  function handleNewNote() {
    const newNote = {
      id: Date.now(),
      title: 'Untitled note',
      preview: '',
      content: '',
      editedAt: 'Just now',
    }
    setNotes((prev) => [newNote, ...prev])
    setActiveId(newNote.id)
  }

  function handleDeleteNote(id) {
    setNotes((prev) => {
      const remaining = prev.filter((n) => n.id !== id)
      if (id === activeId && remaining.length > 0) {
        setActiveId(remaining[0].id)
      }
      return remaining
    })
  }

  return (
    <div className="notes-app">
      <aside className="notes-sidebar">
        <div className="notes-sidebar-header">
          <span className="notes-app-icon" aria-hidden="true">
            📝
          </span>
          <div>
            <span className="notes-app-title">My notes</span>
            <span className="notes-sidebar-count">{notes.length} notes</span>
          </div>
        </div>

        <div className="notes-search-wrap">
          <input
            type="text"
            className="notes-search"
            placeholder="Search notes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="notes-new-wrap">
          <button className="notes-new-btn" onClick={handleNewNote}>
            + New note
          </button>
        </div>

        <div className="notes-list">
          {filteredNotes.map((note) => (
            <button
              key={note.id}
              className={
                'notes-list-item' +
                (note.id === activeId ? ' notes-list-item-active' : '')
              }
              onClick={() => setActiveId(note.id)}
              aria-current={note.id === activeId ? 'true' : undefined}
            >
              <div className="notes-list-item-heading">
                <p className="notes-list-item-title">
                  {note.title || 'Untitled note'}
                </p>
                <span className="notes-list-item-meta">{note.editedAt}</span>
              </div>
              <p className="notes-list-item-preview">{note.preview}</p>
            </button>
          ))}
          {filteredNotes.length === 0 && (
            <p className="notes-empty-hint">No notes match your search.</p>
          )}
        </div>
      </aside>

      <main className="notes-editor">
        {activeNote ? (
          <>
            <div className="notes-editor-toolbar">
              <span className="notes-editor-meta">
                Edited {activeNote.editedAt}
              </span>
              <div className="notes-editor-actions">
                <button
                  className="notes-icon-btn"
                  aria-label="Pin note"
                  title="Pin note"
                >
                  📌
                </button>
                <button
                  className="notes-icon-btn"
                  aria-label="Delete note"
                  title="Delete note"
                  onClick={() => handleDeleteNote(activeNote.id)}
                >
                  🗑
                </button>
              </div>
            </div>

            <div className="notes-editor-body">
              <input
                type="text"
                className="notes-editor-title"
                value={activeNote.title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
              <textarea
                className="notes-editor-content"
                value={activeNote.content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Start writing..."
              />
            </div>
          </>
        ) : (
          <div className="notes-editor-empty">
            <p>Select or create a note to get started.</p>
          </div>
        )}
      </main>
    </div>
  )
}
