require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Person = require('./models/person')

// define a custom token.
// returns the request body as a string,
// or and empty string if body is empty
morgan.token('content', (req) => {
  if (Object.keys(req.body).length === 0) {
    return ''
  } else {
    return JSON.stringify(req.body)
  }
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

// use json parser
app.use(express.json())
// use logger with custom formatting
app.use(morgan(':method :url :status :response-time ms :res[content-length] :content'))
// enable cors
app.use(cors())
// provide static content
app.use(express.static('dist'))

app.get('/', (req, res) => {
  res.sendStatus(200)
})

/**
 * Route providing all entries
 */
app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    persons = persons.map((person) => person.toJSON())
    response.json(persons)
  })
})

/**
 * Route providing a single entry
 */
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then((person) => {
    if (person) {
      res.json(person.toJSON())
    } else {
      res.status(404).end()
    }
  })
    .catch((error) => next(error))
})

/**
 * Route for info-page
 */
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then((count) => {
      res.send(`
                <p>Phonebook has info for ${count} people</p>
                <p>${new Date().toString()}</p>
            `)
    })
    .catch((error) => next(error))
})

/**
 * Route for deleting an entry
 */
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((error) => next(error))
})

/**
 * Route for editing an entry
 *
 * @returns the modified resource
 */
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' },
  )
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => next(error))
})

/**
 * Route for adding a new entry
 */
app.post('/api/persons', (req, res, next) => {
  const body = req.body

  // if name is missing
  if (!body.name) {
    return res.status(400).json({
      error: 'Name missing',
    })
  }

  // if number missing
  if (!body.number) {
    return res.status(400).json({
      error: 'Number missing',
    })
  }

  // a case insensitive search for the name.
  Person.findOne({ name: { $regex: new RegExp(`^${body.name}$`, 'i') } })
    .then((existingPerson) => {
      if (existingPerson) {
        return res.status(400).json({
          error: 'Name already exists',
        })
      }
      const person = new Person({
        name: body.name,
        number: body.number,
      })

      person.save()
        .then((savedPerson) => {
          res.json(savedPerson)
        })
        .catch((error) => next(error))
    })
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
