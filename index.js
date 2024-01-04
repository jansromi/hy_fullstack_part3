const express = require('express');
const morgan = require('morgan')
const cors = require('cors')

const app = express();

// define a custom token.
// returns the request body as a string,
// or and empty string if body is empty
morgan.token('content', req => {
    if (Object.keys(req.body).length === 0) {
        return ""
    } else {
        return JSON.stringify(req.body);
    }
})

// use json parser
app.use(express.json());
// use logger with custom formatting
app.use(morgan(':method :url :status :response-time ms :res[content-length] :content'))
// enable cors
app.use(cors())
// provide static content
app.use(express.static('dist'))

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
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
})

/**
 * @returns a random number between 1-10000
 */
const genId = () =>  {
    return Math.floor(Math.random() * 10000) + 1;
}

/**
 * Iterate over persons
 * and create a new array with updated object
 * @param {int} id 
 * @param {json} updatedPerson 
 */
const updatePerson = (id, updatedPerson) => {
    persons = persons.map(person => {
      if (person.id === id) {
        return updatedPerson;
      }
      return person;
    });
};

/**
 * Route for editing an entry
 * 
 * @returns the modified resource
 */
app.patch('/api/persons/:id', (req, res) => {
    
    const id = Number(req.params.id);
    const foundPerson = persons.find(person => person.id === id);

    if (!foundPerson) {
        return res.status(404).json({
            error: 'Resource not found'
        })
    } 

    const newValue = req.body;
    let person = {...foundPerson}


    if (newValue.hasOwnProperty('number')) {
        const newNumber = newValue.number;
        person.number = newNumber;
        updatePerson(person.id, person);
    }

    return res.json(person)
})

app.post('/api/persons', (req, res) => {
    const body = req.body;

    // if name is missing
    if (!body.name) {
        return res.status(400).json({ 
            error: 'Name missing' 
          })
    }

    // if number missing
    if (!body.number) {
        return res.status(400).json({ 
            error: 'Number missing' 
          })
    }

    const nameExists = persons.some(person => person.name.toLowerCase() === body.name.toLowerCase());

    // if person is already in the listing
    if (nameExists) {
        return res.status(400).json({ 
            error: 'Name already exists' 
        });
    }

    const person = {
        id: genId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(person)

    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});