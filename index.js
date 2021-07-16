require("dotenv").config();
const express = require("express");
const cors = require("cors");
var morgan = require("morgan");
const Person = require("./models/person");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("build"));

// morgan middleware
morgan.token("type", function (req, res) {
  if (req.method === "POST") return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :type")
);

// fetch all persons
app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

// fetch info
app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>`);
  });
});

// fetch a single resource
app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    if (person) {
      response.json(person);
    } else {
      return response.status(400).json({
        error: "id not found",
      });
    }
  });
});

// // delete resources
// app.delete("/api/persons/:id", (request, response) => {
//   const id = Number(request.params.id);
//   persons = persons.filter((person) => person.id !== id);

//   response.status(204).end();
// });

// receive data
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "missing name/number",
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((result) => {
    console.log(`added ${result.name} ${result.number} to phonebook`);
    response.json(result);
  });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
