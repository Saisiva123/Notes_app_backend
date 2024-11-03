const express = require("express");
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log(process.env.MONGO_DB_CONNECTION_URI)

mongoose.connect(process.env.MONGO_DB_CONNECTION_URI).then((res) => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log("Error while connecting to the database", err);
});


//schema
const noteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    text: {
        type: String,
        required: true
    },
});

const Note = mongoose.model('Note', noteSchema);

// routes

app.post("/api/notes", async (req, res) => {
    console.log(req.body)
    try {
        const newNote = new Note(req.body);
        await newNote.save();
        res.status(201).send(newNote);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

app.get("/api/notes", async (req, res) => {
    try {
        const notes = await Note.find({});
        res.status(200).json(notes);
    }
    catch(err){
        res.status(500).json({ message: 'Notes not found.' });
    }
    
})

app.delete('/api/notes/:id', async (req, res) => {
    const { id } = req.params;

    try {

      const deletedNote = await Note.findByIdAndDelete(new mongoose.Types.ObjectId(id));
      res.status(200).send({ message: 'Note deleted successfully', note: deletedNote });

    } catch (err) {
      res.status(500).send({ message: 'Server error', error: err });
    }
  });

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Listenig on the port ", PORT);
})