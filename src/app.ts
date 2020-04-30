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
import * as userController from './controllers/user';
import * as healthController from './controllers/health';

const MongoStore = mongo(session);
const app = express();

const mongoUrl = process.env.DB_STRING || 'mongodb://localhost:27017/cart';
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
    'Content-Type, Authorization, Content-Length, X-Requested-With'
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
app.post('/register', userController.postSignup);
app.post('/login', userController.postLogin);
app.get('/user', userController.getUserInfo);

export default app;
