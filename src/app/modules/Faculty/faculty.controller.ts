import { Request, Response } from 'express';
import catchAsnyc from '../../uits/catchAsync';
import sendSuccessResponse from '../../uits/successResponse';
import { FacultyServices } from './faculty.service';

const getAllFacultyMembers = catchAsnyc(async (req: Request, res: Response) => {
  const query = req?.query;

  const result = await FacultyServices.getAllFacultiesFromDB(query);
  //send success response to client
  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Students data retrived successfully.',
    data: result,
  });
});
const getSingleFaculty = catchAsnyc(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FacultyServices.getSingleFacultyFromDB(id);

  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty data retrived successfully.',
    data: result,
  });
});
const updateFaculty = catchAsnyc(async (req: Request, res: Response) => {
  const { faculty } = req.body;
  const { id } = req.params;
  const result = await FacultyServices.updateFacultyIntoDB(id, faculty);
  //send success response to client
  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty data updated successfully.',
    data: result,
  });
});
const deleteFaculty = catchAsnyc(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FacultyServices.deleteFacultyFromDB(id);
  //send success response to client
  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty data deleted successfully.',
    data: result,
  });
});
export const FacultyConterollers = {
  getAllFacultyMembers,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
};
