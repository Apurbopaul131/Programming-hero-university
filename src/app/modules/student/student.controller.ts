import { Request, Response } from 'express';
import catchAsnyc from '../../uits/catchAsync';
import sendSuccessResponse from '../../uits/successResponse';
import { StudentServices } from './student.service';
//This function is used to avoid repeated try catch block

const getSingleStudent = catchAsnyc(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudentServices.getSingleStudentFromDB(id);

  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student data retrived successfully.',
    data: result,
  });
});

const deleteSingleStudent = catchAsnyc(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await StudentServices.deleteSingleStudentFromDB(id);
  //send success response to client
  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student data deleted successfully.',
    data: result,
  });
});

const updateSingleStudent = catchAsnyc(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { student } = req.body;
  const result = await StudentServices.updateSingleStudentIntoDB(id, student);
  //send success response to client
  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student data updated successfully.',
    data: result,
  });
});

const getAllStudent = catchAsnyc(async (req: Request, res: Response) => {
  const result = await StudentServices.getAllStudentFromDB(req.query);
  console.log(req.cookies);
  //send success response to client
  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Students data retrived successfully.',
    data: result,
  });
});
export const StudentControllers = {
  getSingleStudent,
  deleteSingleStudent,
  getAllStudent,
  updateSingleStudent,
};
