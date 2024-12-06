/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import express, { NextFunction, Request, Response } from 'express';

const globalErrorHandler = ((
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const statuscode = 500;
  const message = err.message || 'Internal server error!';
  return res.status(statuscode).json({
    success: false,
    message: message,
    data: err,
  });
  //write utility function
  //   sendErrorResponse(res, {
  //     statusCode: statuscode,
  //     success: false,
  //     message: message,
  //     data: err,
  //   });
}) as unknown as express.ErrorRequestHandler;
//you can aslo handle error by type assertion
export default globalErrorHandler;
