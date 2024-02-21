const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

let contactName = "";
let contactNumber = "";
let contactAdded = false;

// if both name and number are provided
if (process.argv.length === 5) {
    contactName = process.argv[3];
    contactNumber = process.argv[4];
    contactAdded = true;
}

const url =
  `mongodb+srv://fullstack:${password}@hyfs.k3aluku.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)
  
const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

const Contact = mongoose.model('Contact', contactSchema)

// creating a new contact
if (contactAdded) {
    const contact = new Contact({
        name: contactName,
        number: contactNumber,
    })

    contact.save().then(response => {
        console.log(`added ${contactName} number ${contactNumber} to phonebook`)
        mongoose.connection.close()
    })
} else {
    // listing all contacts
    Contact.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(contact => {
            console.log(contact.name, contact.number)
        })
        mongoose.connection.close()
    })
}

