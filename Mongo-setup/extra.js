const express = require("express");
const app = express();
const cors = require("cors");
const proxy = require("http-proxy-middleware");
var jwt = require("jsonwebtoken");
var fs = require("fs");

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
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/login/users", (req, res) => {
  res.send(users);
});

app.post("/login/users", cors(), (req, res) => {
  console.log("*****", req.body);

  const token = jwt.sign({ userEmail: req.body.email }, configKey, {
    expiresIn: "1h"
  }); // Create a token for client

  const user = {
    email: req.body.email,
    token: token
  };

  users.push(user);
  return res.send(user);
});

const port = process.env.port || 3000;
app.listen(port, () => console.log(`listening to port ${port}...`));
