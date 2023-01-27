const fs = require('fs');
const express = require('express');
const path = require('path');
const db = require('./db/db.json');
const uniqid = require('uniqid');

const PORT = process.env.PORT || 3001;

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET route for homepage
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET route to retrieve all saved notes
app.get('/api/notes', (req, res) => {
    res.json(db);
  });

// POST route for adding note
app.post('/api/notes', (req, res) => {

  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      review_id: uniqid(),
    };

    const noteString = JSON.stringify(newNote);

    fs.writeFile(db, noteString);

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.json(response);
  } else {
    res.json('Error in posting note');
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);