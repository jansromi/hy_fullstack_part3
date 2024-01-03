const express = require('express');
const app = express();

// use json parser
app.use(express.json());


const persons = require('./persons');


app.get('/', (req, res) => {
    res.sendStatus(200);
})

app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.get('/info', (req, res) => {
    res.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date().toString()}</p>
    `);
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});