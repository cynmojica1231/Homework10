/* DEPENDENCIES */
const express = require("express");
const path = require("path");
const fs = require("fs");

const notesArray = require("./db/db.json");

/* SETS UP THE EXPRESS APP */
const app = express();
const PORT = process.env.PORT || 3000;

/* SETS UP THE EXPRESS APP TO HANDLE DATA PARSING */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Use /public as root folder
app.use(express.static(__dirname + "/public"));

/* STARTS THE SERVER TO BEGIN LISTENING */
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});

/* ROUTES */

// GETs

// Basic routes that take user to each HTML page
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// Returns all notes from notesArray when getNotes() is called in index.js
app.get("/api/notes", function (req, res) {
  return res.json(JSON.parse(fs.readFileSync("./db/db.json")));
});

// POSTs

// Route for saving a note to db.json
app.post("/api/notes", function (req, res) {
  // req.body is JSON post sent from UI
  let newNoteRequest = req.body;
  console.log("New request: ", newNoteRequest);

  notesArray.push(newNoteRequest);
  // Set id property of newNoteRequest to its index in notesArray
  newNoteRequest.id = notesArray.indexOf(newNoteRequest);

  fs.writeFileSync("./db/db.json", JSON.stringify(notesArray));

  res.json({
    isError: false,
    message: "Note successfully saved",
    port: PORT,
    status: 200,
    success: true,
  });
});
app.delete("/api/notes/:id", function (req, res) {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let noteID = req.params.id;
  let newID = 0;
  console.log(`Deleting note with ID ${noteID}`);
  savedNotes = savedNotes.filter((currNote) => {
    return currNote.id != noteID;
  });

  for (currNote of savedNotes) {
    currNote.id = newID.toString();
    newID++;
  }

  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
  res.json(savedNotes);
});

app.listen(port, function () {
  console.log(`Now listening to port ${port}. Enjoy your stay!`);
});
