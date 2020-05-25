import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import mongo from 'connect-mongo';
import mongoose from 'mongoose';
import bluebird from 'bluebird';
import jwt from 'jsonwebtoken';
import fs from 'fs';

import * as userController from './controllers/user';
import * as healthController from './controllers/health';

const MongoStore = mongo(session);
const app = express();
const configKey = fs.readFileSync('./config.key', 'utf8');

const mongoUrl = process.env.DB_STRING || 'mongodb://mongo:27017/cart';
mongoose.Promise = bluebird;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running. ' + err
    );
  });
const logger = require('./util/logger').getAccessLogger();
dotenv.config();
app.set('port', process.env.PORT || 3000);

app.use(express.json()); //adding a piece of middleware by express.json
app.use(express.urlencoded({ extended: false }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Access-Control-Allow-Headers, Authorization,  X-Requested-With'
  );
  next();
});

// HTTP Request Logger
app.use(
  morgan('combined', {
    stream: {
      write: function(meta: any) {
        logger.info(meta);
      }
    }
  })
);

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dcsbjvbdfn',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30 * 60 * 1000,
      httpOnly: true
    },
    store: new MongoStore({
      url: mongoUrl,
      autoReconnect: true
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.get('/health', healthController.health);
app.post('/login', userController.postLogin);
app.post('/register', userController.postSignup);

const skipPaths = ['/login', '/health', '/register'];

//Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const path = req.path;
  console.log('path: ' + path);

  if (!skipPaths.includes(path) && req.method !== 'OPTIONS') {
    const token = req.headers['authorization'];
    console.log('token:' + token);

    if (!token) {
      res.status(401).json({ success: false, message: 'No token provided' }); // Return error
    } else {
      // Verify the token is valid
      jwt.verify(token, configKey, (err: any, decoded: any) => {
        // Check if error is expired or invalid
        if (err) {
          res
            .status(401)
            .json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
        } else {
          // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
          (<any>req).decoded = decoded;
          console.log(decoded);
          // Create global variable to use in any request beyond
          next(); // Exit middleware
        }
      });
    }
  } else {
    next();
  }
});

app.get('/user', userController.getUserInfo);
app.get('/logout', userController.logout);
app.get('/isUserLoggedIn', userController.isUserLoggedIn);
export default app;
