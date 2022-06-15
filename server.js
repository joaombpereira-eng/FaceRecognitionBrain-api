const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "joaombpereira",
    password: "",
    database: "smartbrain",
  },
});

db.select("*")
  .from("users")
  .then((data) => {
    console.log(data);
  });

const app = express();
app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "João",
      email: "joao@hotmail.com",
      password: "ratinho",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "1234",
      name: "Ana",
      email: "ana@hotmail.com",
      password: "ratinha",
      entries: 0,
      joined: new Date(),
    },
  ],
};

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json("Error logging in.");
  }
  res.json("Signin.");
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  db("users")
    .returning("*")
    .insert({
      email: email,
      name: name,
      joined: new Date(),
    })
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => res.status(400).json(err));
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json("Not found!");
  }
});

app.put("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json("Not found!");
  }
});

// bcrypt.hash(password, null, null, function (err, hash) {
//   console.log(hash);
// });
// Load hash from your password DB.
// bcrypt.compare(
//   "miguel",
//   "$2a$10$dE9qkiCUnb03TOZVwK7sHuq9TgPcLHiIoPFRMvKOM3U5jsUjVrzN2",
//   function (err, res) {
//     console.log("first guess", res);
//   }
// );
// bcrypt.compare(
//   "veggies",
//   "$2a$10$dE9qkiCUnb03TOZVwK7sHuq9TgPcLHiIoPFRMvKOM3U5jsUjVrzN2",
//   function (err, res) {
//     console.log("second guess", res);
//   }
// );

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
