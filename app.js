const express = require("express");
const app = express();
var jwt = require("jsonwebtoken");
var fs = require("fs");
// const connection = require("./Mongo");
// const validation = require("./validation");

var configKey = fs.readFileSync("./config.key", "utf8");

app.use(express.json()); //adding a piece of middleware by express.json

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  //   res.status(200).json({});
  next();
});

const users = [];
// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

app.get("/test", async (req, res) => {
  res.json({ message: "pass!" });
});

app.post("/login", (req, res) => {
  const token = jwt.sign({ userEmail: req.body.email }, configKey, {
    expiresIn: "1h"
  });

  const user = {
    email: req.body.email,
    token: token
  };

  users.push(user);
  return res.status(201).send(user);
});

// app.post("/register/users", (req, res) => {
//   console.log("*****", req.body);
//   const validationRequestMessage = validation.validateRequestForRegister(req);
//   if (validationRequestMessage.success == false) {
//     res.json(validationRequestMessage);
//   } else {
//     let message = "";

//     const user = {
//       email: req.body.email,
//       password: req.body.password,
//       name: req.body.name
//     };

//     user.save(err => {
//       if (err) {
//         if (err.code === 11000) {
//           message = "email already exists";
//         } else if (err.errors) {
//           // Validation errors
//           message = "could not save user, Error: " + err.message;
//         }
//         res.json({ success: false, message: message, err });
//       } else {
//         res.json({ success: true, message: "user registered!" });
//       }
//     });
//   }
// });

const port = process.env.port || 3000;
app.listen(port, () => console.log(`listening to port ${port}...`));

module.exports = app;
