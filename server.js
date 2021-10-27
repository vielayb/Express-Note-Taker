const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

/* ------------------------------------------------ */
//route that the front-end can request data from 
const { notes } = require('./db/db');

/* ------------------------------------------------ */
// this is so express can look deeper to find the css script
app.use(express.static('public'));

/* ------------------------------------------------ */
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

/* ------------------------------------------------ */
//this api route leads to the db.json file 
app.get('/api/notes', (req, res) => {
    let results = notes;
    console.log(req.query)
    res.json(results);
});

/* ------------------------------------------------ */
//this route links the index.html 
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });
/* ------------------------------------------------ */
//this route links the notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });
/* ------------------------------------------------ */
//function for new notes reference 11.2.6
  function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
      );
      return note;
  }

/* ------------------------------------------------ */
  function findById(id, notesArray) {
    const result = notesArray.filter(note => note.id === id)[0];
    return result;
  }

/* ------------------------------------------------ */
// this api route query one object
app.get('/api/notes/:id', (req, res) => {
    const result = findById(req.params.id, notes);
    if (result) {
        res.json(result);
      } else {
        res.send(404);
      }
  });

  /* ------------------------------------------------ */
  //reference 11.2.3
  app.post('/api/notes', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = notes.length.toString();

    // req.body is where our incoming content will be
    const note = createNewNote(req.body, notes);
    res.json(note);
  });


app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
  });