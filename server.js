//imports
const fs = require('fs');
const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3001;

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET route for html
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET route to retrieve all saved notes
app.get('/api/notes', (req, res) => {
  fs.readFile('db/db.json', 'utf-8', (err, data) => err ? console.log(err) : res.json(JSON.parse(data)));
});

// POST route for adding note
app.post('/api/notes', (req, res) => {

  const { title, text } = req.body;
  console.log(req.body);

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    console.log(newNote);

    fs.readFile('db/db.json', 'utf-8', (err, data) => {
      if (err) throw err;
      let noteString = JSON.parse(data);
      noteString.push(newNote);
      fs.writeFile('db/db.json', JSON.stringify(noteString), err => err ? console.log(err) : res.redirect('/notes'));
    });
  }
});

app.delete('/api/notes/:id', (req, res) => {
  console.log(req.params);
  fs.readFile('db/db.json', (err, data) => {
    if (err) throw err;
    let noteString = JSON.parse(data);
    const filtered = noteString.filter(note => note.id !== req.params.id);
    fs.writeFile('db/db.json', JSON.stringify(filtered), err => err ? console.log(err) : res.redirect('/notes'));
  });
})

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);