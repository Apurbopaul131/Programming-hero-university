/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import config from '../config';
import AppError from '../error/appError';
import handleDuplicateKeyError from '../error/duplicateKey';
import handeMongooseCastError from '../error/handleMongooseCastError';
import handleMongooseValidationError from '../error/handleMongooseError';
import handleZodError from '../error/handleZodError';
import { TErrorSources, TGenericsErrorResponse } from '../interface/error';

const globalErrorHandler = ((
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statuscode = err?.statusCode || 500;
  let message = err?.message || 'somthing went wrong';
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went wrong',
    },
  ];
  if (err instanceof ZodError) {
    const simplifiedError: TGenericsErrorResponse = handleZodError(err);
    statuscode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof mongoose.Error.ValidationError) {
    const simplifiedError: TGenericsErrorResponse =
      handleMongooseValidationError(err);
    statuscode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof mongoose.Error.CastError) {
    const simplifiedError: TGenericsErrorResponse = handeMongooseCastError(err);
    statuscode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err.code === 11000) {
    const simplifiedError: TGenericsErrorResponse =
      handleDuplicateKeyError(err);
    statuscode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (err instanceof AppError) {
    statuscode = err?.statusCode;
    message = err?.message;
    errorSources = [
      {
        path: '',
        message,
      },
    ];
  } else if (err instanceof Error) {
    message = err?.message;
    errorSources = [
      {
        path: '',
        message,
      },
    ];
  }
  return res.status(statuscode).json({
    success: false,
    message: message,
    errorSources: errorSources,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  });
}) as unknown as express.ErrorRequestHandler;
//you can aslo handle error by type assertion
export default globalErrorHandler;
