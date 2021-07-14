const mongoose = require("mongoose");

// password: agBGYQfUx9sqDNsQ

const newPerson = function (name, number) {
  // generate new objects
  const person = new Person({
    name: name,
    number: number,
  });

  person.save().then((result) => {
    console.log(`added ${result.name} ${result.number} to phonebook`);
    mongoose.connection.close();
  });
};

const getAllPersons = function () {
  console.log(`phonebook: `);
  // fetch all objects from mongodb
  Person.find({}).then((persons) => {
    persons.forEach((person) => {
    console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
};

if (process.argv.length < 3) {
  console.log(
    'to add a new contact: node mongo.js <password> <"name"> <number>'
  );
  console.log("to view all contacts: node mongo.js <password>");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fullstack:${password}@cluster0.zluff.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const name = process.argv[3];
const number = process.argv[4];

if (process.argv.length === 3) {
  getAllPersons();
}

if (process.argv.length >= 5) {
  newPerson(name, number);
}
