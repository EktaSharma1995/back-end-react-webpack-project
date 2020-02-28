import app from './app';
import dotenv from 'dotenv';

const logger = require('./logger').getAccessLogger();
dotenv.config();

const server = app.listen(app.get('port'), () => {
  logger.info(`Server is up and listening to port: ${process.env.PORT}...`);
});

export default server;
