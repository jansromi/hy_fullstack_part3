const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

let personName = "";
let personNumber = "";
let personAdded = false;

// if both name and number are provided
if (process.argv.length === 5) {
    personName = process.argv[3];
    personNumber = process.argv[4];
    personAdded = true;
}

const url =
  `mongodb+srv://fullstack:${password}@hyfs.k3aluku.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)
  
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

const Person = mongoose.model('Person', personSchema)

// creating a new contact
if (personAdded) {
    const person = new Person({
        name: personName,
        number: personNumber,
    })

    person.save().then(response => {
        console.log(`added ${personName} number ${personNumber} to phonebook`)
        mongoose.connection.close()
    })
} else {
    // listing all contacts
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}

