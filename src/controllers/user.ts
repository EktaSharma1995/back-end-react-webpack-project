import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import fs from 'fs';
const logger = require('../util/logger').getAccessLogger();
import jwtDecode from 'jwt-decode';
import jwt from 'jsonwebtoken';
const configKey = fs.readFileSync('./config.key', 'utf8');
import passport from 'passport';
import '../passport-config';
import { User, UserDocument } from '../models/User';

interface TokenObj {
  email: string;
  iat: string;
  exp: string;
}

export const postSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await check('email', 'Email is not valid')
    .isEmail()
    .run(req);
  await check('password', 'Password must be at least 4 characters long')
    .isLength({ min: 4 })
    .run(req);
  await check('confirmPassword', 'Passwords do not match')
    .equals(req.body.password)
    .run(req);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.error('error in validating fields while Sign - Up');
    return res.status(422).json({ errors: errors.array() });
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      logger.error('Account with this username already exists');
      return res.status(403).json({
        success: false,
        message: 'Account with this username already exists'
      });
    }
    user.save(err => {
      if (err) {
        return next(err);
      }
      req.logIn(user, err => {
        if (err) {
          return next(err);
        }
        res.json({ success: true, message: 'user registered' });
      });
    });
  });
};

export const postLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    logger.error('error in validating fields while Login');
    return res.status(422).json({ errors: errors.array() });
  }

  logger.debug('User passed the validation');

  passport.authenticate('local', (err: Error, user: UserDocument) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      logger.error('No user exists with this email');
      return res.status(422);
    }

    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      const email = user.email;
      const token = jwt.sign({ email: email }, configKey, {
        expiresIn: '1h'
      });
      return res.status(201).json({ token });
    });
  })(req, res, next);
};

export const getUserInfo = (req: any, res: any) => {
  const sessionEmail = req.session.passport.user;
  console.log('session email ' + sessionEmail);
  User.findOne({ email: sessionEmail }, (err, userExists) => {
    if (userExists) {
      const email = userExists.email;

      const user = {
        email: email,
        name: 'Navika Sharma'
      };

      return res.status(201).send(user);
    } else {
      return res.json({
        success: false,
        message: 'No match found'
      });
    }
  });
};

// export const getUserInfo = (req: Request, res: Response) => {
//   const token = req.headers['authorization'];
//   if (token) {
//     const decodedToken: TokenObj = jwtDecode(token);

//     User.findOne({ email: decodedToken.email }, (err, userExists) => {
//       if (userExists) {
//         console.log(userExists);
//         return res.status(201).send(userExists);
//       } else {
//         return res.json({
//           success: false,
//           message: 'No match found'
//         });
//       }
//     });
//   } else {
//     return res.json({
//       success: false
//     });
//   }
// };

export const logout = (req: Request, res: Response) => {
  req.logout();
  res.redirect('/login');
};
