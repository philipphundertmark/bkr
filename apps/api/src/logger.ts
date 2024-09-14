import expressWinston from 'express-winston';
import winston from 'winston';

export const loggerOptions = {
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ level, message }) => {
      return `${level}: ${message}`;
    }),
  ),
  transports: [new winston.transports.Console()],
} satisfies winston.LoggerOptions;

export const logger = expressWinston.logger(loggerOptions);
