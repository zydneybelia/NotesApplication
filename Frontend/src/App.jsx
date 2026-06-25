import { useEffect, useState } from 'react'
import './App.css'
import NoteList from './components/NoteList'
import NoteEditor from './components/NoteEditor'

const STORAGE_KEY = 'notesapp.notes'

function App() {
  const [notes, setNotes] = useState([])
  const [activeId, setActiveId] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setNotes(JSON.parse(raw))
    } catch (e) {
      console.error('Failed to load notes', e)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
    } catch (e) {
      console.error('Failed to save notes', e)
    }
  }, [notes])

  function createNote() {
    const newNote = {
      id: Date.now().toString(),
      title: 'Untitled',
      body: '',
      createdAt: Date.now(),
    }
    setNotes((s) => [newNote, ...s])
    setActiveId(newNote.id)
  }

  function updateNote(id, patch) {
    setNotes((s) => s.map((n) => (n.id === id ? { ...n, ...patch } : n)))
  }

  function deleteNote(id) {
    setNotes((s) => s.filter((n) => n.id !== id))
    if (activeId === id) setActiveId(null)
  }

  const activeNote = notes.find((n) => n.id === activeId) || notes[0] || null

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>NotesApplication</h1>
        <div className="header-actions">
          <button onClick={createNote}>New Note</button>
        </div>
      </header>
      <main className="app-main">
        <aside className="sidebar">
          <NoteList
            notes={notes}
            onSelect={(id) => setActiveId(id)}
            onDelete={deleteNote}
            activeId={activeId}
          />
        </aside>
        <section className="editor">
          <NoteEditor
            note={activeNote}
            onChange={(patch) => {
              if (!activeNote) return
              updateNote(activeNote.id, patch)
            }}
            onDelete={() => activeNote && deleteNote(activeNote.id)}
          />
        </section>
      </main>
    </div>
  )
}

export default App
