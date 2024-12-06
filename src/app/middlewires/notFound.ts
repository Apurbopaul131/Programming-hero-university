/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';
import sendSuccessResponse from '../uits/successResponse';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  sendSuccessResponse(res, {
    statusCode: 404,
    success: false,
    message: 'Not found error!',
    data: {},
  });
};

export default notFound;
