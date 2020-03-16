import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import fs from 'fs';
const logger = require('../util/logger').getAccessLogger();
import jwt from 'jsonwebtoken';
const configKey = fs.readFileSync('./config.key', 'utf8');

interface LoginResponse {
  email: string;
  token: string;
}
const users = [];

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
};
