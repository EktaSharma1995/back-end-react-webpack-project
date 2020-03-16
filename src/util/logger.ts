import { createLogger, transports, format } from 'winston';

function getAccessLogger() {
  const colorizer = format.colorize();

  const loggingOptions = {
    file: {
      level: 'info',
      filename: 'logs/access.log',
      json: true,
      colorize: false
    },
    console: {
      level: 'debug',
      json: true,
      colorize: true,
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(msg =>
          colorizer.colorize(
            msg.level,
            `${msg.timestamp} - ${msg.level}: ${msg.message}`
          )
        )
      )
    }
  };

  const logger = createLogger({
    transports: [
      new transports.Console(loggingOptions.console),
      new transports.File({ filename: loggingOptions.file.filename })
    ],
    exitOnError: false
  });

  return logger;
}

exports.getAccessLogger = getAccessLogger;
