const express = require('express');
const app = express();
const cors = require('cors');
const proxy = require('http-proxy-middleware');
var jwt = require('jsonwebtoken');
var fs = require('fs');

var configKey = fs.readFileSync('./config.key', 'utf8');

app.use(express.json()); //adding a piece of middleware by express.json

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'
  );
  //   res.status(200).json({});
  next();
});

const users = [];
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/login/users', (req, res) => {
  res.send(users);
});

app.post('/login/users', cors(), (req, res) => {
  console.log('*****', req.body);

  const token = jwt.sign({ userEmail: req.body.email }, configKey, {
    expiresIn: '1h'
  }); // Create a token for client

  const user = {
    email: req.body.email,
    token: token
  };

  users.push(user);
  return res.send(user);
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
