import { Request, Response } from 'express';
import catchAsnyc from '../../uits/catchAsync';
import sendSuccessResponse from '../../uits/successResponse';
import { UserServices } from './user.service';

const createStudent = catchAsnyc(async (req: Request, res: Response) => {
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

const createFaculty = catchAsnyc(async (req: Request, res: Response) => {
  //take data from client request body
  const { password, faculty: FacultyData } = req.body;
  const result = await UserServices.createFacultyToDB(password, FacultyData);
  //call sendErrorResponse function to send response to client
  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty Created successfully',
    data: result,
  });
});
const createAdmin = catchAsnyc(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserServices.createAdminToDB(password, adminData);

  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin is created succesfully',
    data: result,
  });
});
export const UserControllers = {
  createStudent,
  createFaculty,
  createAdmin,
};
