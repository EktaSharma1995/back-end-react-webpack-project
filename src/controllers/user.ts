import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import fs from 'fs';
const logger = require('../util/logger').getAccessLogger();
import jwtDecode = require('jwt-decode');
import jwt from 'jsonwebtoken';
const configKey = fs.readFileSync('./config.key', 'utf8');

interface TokenObj {
  email: string;
  iat: string;
  exp: string;
}

const users = [
  { name: 'Nivaan Sharma', email: 'nivaansharma2015@gmail.com' },
  { name: 'Navika Sharma', email: 'navikasharma2019@gmail.com' },
  { name: 'Riaan Sharma', email: 'riaansharma2019@gmail.com' }
];

export const postLogin = async (req: Request, res: Response) => {
  await check('email')
    .isEmail()
    .run(req);
  // password must be at least 5 chars long
  await check(
    'password',
    'The password must be 5+ chars long and contain a number'
  )
    .isLength({ min: 5 })
    .not()
    .isIn(['password', 'god'])
    .withMessage('Do not use a common word as the password')
    .matches(
      /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/,
      'Not a valid format'
    )
    .run(req);

  const errors = validationResult(req);
  logger.error(errors);
  if (!errors.isEmpty()) {
    logger.error('error in validating fields');
    return res.status(422).json({ errors: errors.array() });
  }

  logger.debug('User passed the validation');

  const email = users.find(({ email }) => email === req.body.email);

  if (email) {
    logger.info('Email exists');

    const token = jwt.sign({ email: req.body.email }, configKey, {
      expiresIn: '1h'
    });
    return res.status(201).json({ token });
  } else {
    logger.info('Email not exist');
    return res
      .status(404)
      .json({ success: 'false', message: 'Email/password not matched' });
  }
};

export const getUserInfo = (req: Request, res: Response) => {
  const token = req.headers['authorization'];
  if (token) {
    const decodedToken: TokenObj = jwtDecode(token);

    const userObj = users.filter(
      userIterator => decodedToken.email === userIterator.email
    );

    if (userObj) {
      logger.info('User matched for the information');
      console.log(userObj);
      return res.status(201).send(userObj);
    } else {
      return res.json({
        success: false,
        message: 'No match found'
      });
    }
  } else {
    return res.json({
      success: false,
      message: 'Token is missing'
    });
  }
};
