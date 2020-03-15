import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { check, validationResult } from 'express-validator';
import morgan from 'morgan';
import * as userController from './controllers/user';

const configKey = fs.readFileSync('./config.key', 'utf8');
const app = express();
const logger = require('./logger').getAccessLogger();

app.set('port', process.env.PORT || 3000);

app.use(express.json()); //adding a piece of middleware by express.json

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'
  );
  next();
});

app.use(
  morgan('combined', {
    stream: {
      write: function(meta: any) {
        logger.info(meta);
      }
    }
  })
);
const users = [];
// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

app.get('/test', (req, res) => {
  res.json({ message: 'pass!' });
});

interface LoginResponse {
  email: string;
  token: string;
}

app.get('/health', (req, res) => {
  res.send({ status: 200, message: 'success' });
});

app.post(
  '/login',
  [
    check('email').isEmail(),
    // password must be at least 5 chars long
    check('password', 'The password must be 5+ chars long and contain a number')
      .isLength({ min: 5 })
      .not()
      .isIn(['password', 'god'])
      .withMessage('Do not use a common word as the password')
      .matches(
        /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
        'Not a valid format'
      )
  ],
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      logger.error('error in validating fields');
      return res.status(422).json({ errors: errors.array() });
    }

    logger.debug('User passed the validation');

    const token = jwt.sign({ userEmail: req.body.email }, configKey, {
      expiresIn: '1h'
    });

    const user: LoginResponse = {
      email: req.body.email,
      token: token
    };

    users.push(user);
    return res.status(201).send(user);
  }
);

export default app;
