import { Request, Response } from 'express';
import catchAsnyc from '../../uits/catchAsync';
import sendSuccessResponse from '../../uits/successResponse';
import { UserServices } from './user.service';

const createUser = catchAsnyc(async (req: Request, res: Response) => {
  //take data from client request body
  const { password, student: StudentData } = req.body;
  const result = await UserServices.createStudentToDB(password, StudentData);
  //call sendErrorResponse function to send response to client
  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student Created successfully',
    data: result,
  });
});
export const UserControllers = {
  createUser,
};
