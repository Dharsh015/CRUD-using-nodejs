const connection =require('./connection')
const express = require('express');
const bodyParser = require('body-parser');
const cors =require('cors');



const app = express();
app.use(cors());
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Create a new student
app.post('/students', (req, res) => {
  const { id, name, age, email } = req.body;
  const sql = 'INSERT INTO students (id, name, age, email) VALUES (?, ?, ?, ?)';
  connection.query(sql, [id, name, age, email], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json(req.body);
  });
});

// Get all students
app.get('/students', (req, res) => {
  const sql = 'SELECT * FROM students';
  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Get a student by ID
app.get('/students/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM students WHERE id = ?';
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(results[0]);
  });
});

// Update a student
app.patch('/students/:id', (req, res) => {
  const { id } = req.params;
  const { name, age, email } = req.body;
  const sql = 'UPDATE students SET name = ?, age = ?, email = ? WHERE id = ?';
  connection.query(sql, [name, age, email, id], (err, results) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(req.body);
  });
});

// Delete a student
app.delete('/students/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM students WHERE id = ?';
  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Error deleting data:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  });
});





app.listen(3000,()=>console.log('express server is running on port 3000'))
