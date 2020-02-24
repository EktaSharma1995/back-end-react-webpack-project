const express = require('express');
const app = express();
var jwt = require('jsonwebtoken');
var fs = require('fs');
const logger = require('./logger').getAccessLogger();
const { check, validationResult } = require('express-validator');
const morgan = require('morgan');

var configKey = fs.readFileSync('./config.key', 'utf8');

app.use(express.json()); //adding a piece of middleware by express.json

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'
  );
  next();
});

app.use(
  morgan('short', {
    stream: {
      write: function(message, encoding) {
        logger.info(message);
      }
    }
  })
);
const users = [];
// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

app.get('/test', async (req, res) => {
  res.json({ message: 'pass!' });
});

app.post(
  '/login',
  [
    check('email').isEmail(),
    // password must be at least 5 chars long
    check('password').isLength({ min: 5 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      logger.error(`error in validating fields`);
      return res.status(422).json({ errors: errors.array() });
    }

    logger.debug('User passed the validation');

    const token = jwt.sign({ userEmail: req.body.email }, configKey, {
      expiresIn: '1h'
    });

    const user = {
      email: req.body.email,
      token: token
    };

    users.push(user);
    return res.status(201).send(user);
  }
);

const port = process.env.port || 3000;
app.listen(port, () =>
  logger.info(`Server is up and listening to port: ${port}...`)
);

module.exports = app;
