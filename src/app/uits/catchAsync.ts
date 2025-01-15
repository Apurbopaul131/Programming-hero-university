import { NextFunction, Request, RequestHandler, Response } from 'express';

//This function used for avoid repeated try catch block
const catchAsnyc = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};
export default catchAsnyc;
