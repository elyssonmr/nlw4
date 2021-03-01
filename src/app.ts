import 'reflect-metadata';

import express, { NextFunction, Request, Response, response } from 'express';
import "express-async-errors";
import createConnection from './database';
import { router } from './routes';
import { AppError } from './errors/AppError';

createConnection();

const app = express();

app.use(express.json());
app.use(router);
app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
  if(err instanceof AppError) {
    const errBody = {
      message: err.message,
      errors: err.errors
    };
    return response.status(err.statusCode).json(errBody);
  }
  return response.status(500).json({
    message: `Internal Server Error: ${err.message}`
  });
});

export { app }
