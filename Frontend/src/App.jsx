import { useState, useEffect } from 'react'
import NoteList from './components/NoteList'
import NoteEditor from './components/NoteEditor'
import './NotesApp.css'

const API = 'http://localhost:8080/api/notes'

export default function NotesApp() {
  const [notes, setNotes] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  const activeNote = notes.find((n) => n.id === activeId)

  // Fetch all notes on load
  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        setNotes(data)
        if (data.length > 0) setActiveId(data[0].id)
      })
      .catch((err) => console.error('Failed to fetch notes:', err))
      .finally(() => setLoading(false))
  }, [])

  const filteredNotes = notes.filter((n) =>
    (n.title || '').toLowerCase().includes(query.toLowerCase())
  )

  async function handleNewNote() {
    const newNote = { title: 'Untitled note', content: '' }
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNote),
      })
      const saved = await res.json()
      setNotes((prev) => [saved, ...prev])
      setActiveId(saved.id)
    } catch (err) {
      console.error('Failed to create note:', err)
    }
  }

  async function handleChange(field) {
    const updated = { ...activeNote, ...field }
    setNotes((prev) => prev.map((n) => (n.id === activeId ? updated : n)))

    try {
      await fetch(`${API}/${activeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: updated.title, content: updated.content }),
      })
    } catch (err) {
      console.error('Failed to update note:', err)
    }
  }

  async function handleDelete(id) {
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' })
      setNotes((prev) => {
        const remaining = prev.filter((n) => n.id !== id)
        if (id === activeId) setActiveId(remaining.length > 0 ? remaining[0].id : null)
        return remaining
      })
    } catch (err) {
      console.error('Failed to delete note:', err)
    }
  }

  return (
    <div className="notes-app">
      <aside className="notes-sidebar">
        <div className="notes-sidebar-header">
          <span className="notes-app-icon">📝</span>
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

        {loading ? (
          <p className="notes-empty-hint">Loading...</p>
        ) : (
          <NoteList
            notes={filteredNotes}
            activeId={activeId}
            onSelect={setActiveId}
            onDelete={handleDelete}
          />
        )}
      </aside>

      <main className="notes-editor">
        <NoteEditor
          note={activeNote}
          onChange={handleChange}
          onDelete={() => handleDelete(activeId)}
        />
      </main>
    </div>
  )
}