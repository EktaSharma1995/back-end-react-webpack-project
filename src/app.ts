import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import * as userController from './controllers/user';
import * as healthController from './controllers/health';

const app = express();
const logger = require('./util/logger').getAccessLogger();

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

app.get('/health', healthController.health);
app.post('/login', userController.postLogin);

export default app;
