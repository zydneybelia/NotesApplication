const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test DB connection
pool.connect((err) => {
  if (err) console.error('Database connection failed:', err);
  else console.log('Connected to Supabase PostgreSQL');
});

// GET all notes
app.get('/api/notes', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM notes ORDER BY edited_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('GET error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST create note
app.post('/api/notes', async (req, res) => {
  try {
    const { title, content } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO notes (title, content, edited_at) VALUES ($1, $2, NOW()) RETURNING *',
      [title, content]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT update note
app.put('/api/notes/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const { rows } = await pool.query(
      'UPDATE notes SET title=$1, content=$2, edited_at=NOW() WHERE id=$3 RETURNING *',
      [title, content, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Note not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('PUT error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM notes WHERE id=$1', [req.params.id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Note not found' });
    res.sendStatus(204);
  } catch (err) {
    console.error('DELETE error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));