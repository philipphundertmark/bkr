import expressWinston from 'express-winston';
import winston from 'winston';

export const loggerOptions = {
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    }),
  ),
  transports: [new winston.transports.Console()],
} satisfies winston.LoggerOptions;

export const logger = expressWinston.logger(loggerOptions);
