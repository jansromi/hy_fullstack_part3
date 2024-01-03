const express = require('express');
const app = express();

// use json parser
app.use(express.json());


let persons = require('./persons');


app.get('/', (req, res) => {
    res.sendStatus(200);
})

/**
 * Route providing all entries
 */
app.get('/api/persons', (req, res) => {
    res.json(persons);
})

/**
 * Route providing a single entry
 */
app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);

    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
})

/**
 * Route for info-page
 */
app.get('/info', (req, res) => {
    // send how many entries and current date
    res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toString()}</p>
    `);
})

/**
 * Route for deleting an entry
 */
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    // filter the array to return a new array without the deleted entry
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});