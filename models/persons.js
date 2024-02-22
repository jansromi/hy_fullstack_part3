const Person = require('./person')

const getPersons = () => {
  return Person.find({})
}

module.exports = getPersons