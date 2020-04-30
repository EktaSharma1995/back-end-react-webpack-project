import passport from 'passport';
import passportLocal from 'passport-local';

import { User, UserDocument } from './models/User';
import { Request, Response, NextFunction } from 'express';
const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((user, done) => {
  console.log('serialize');
  done(null, user.email);
});

passport.deserializeUser((email: string, done) => {
  console.log('de - serialize');
  User.findOne({ email: email }, (err: any, user) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err, user: any) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(undefined, false, { message: `Email ${email} not found.` });
      }
      user.comparePassword(password, (err: Error, isMatch: boolean) => {
        if (err) {
          return done(err);
        }
        if (isMatch) {
          return done(undefined, user);
        }
        return done(undefined, false, {
          message: 'Invalid email or password.'
        });
      });
    });
  })
);
