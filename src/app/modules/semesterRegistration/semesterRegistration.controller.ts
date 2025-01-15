import { Request, Response } from 'express';
import catchAsnyc from '../../uits/catchAsync';
import sendSuccessResponse from '../../uits/successResponse';
import { SemesterRegistrationServices } from './semesterRegistration.service';

const createSemesterRegistration = catchAsnyc(
  async (req: Request, res: Response) => {
    const result =
      await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
        req.body,
      );

    sendSuccessResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Semester Registration is created successfully!',
      data: result,
    });
  },
);
const getAllSemesterRegistrations = catchAsnyc(
  async (req: Request, res: Response) => {
    const result =
      await SemesterRegistrationServices.getAllSemesterRegistrationsFromDB(
        req.query,
      );

    sendSuccessResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Semester Registrations is retrieved successfully !',
      data: result,
    });
  },
);
const getSingleSemesterRegistration = catchAsnyc(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const result =
      await SemesterRegistrationServices.getSingleSemesterRegistrationsFromDB(
        id,
      );

    sendSuccessResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Semester Registration is retrieved successfully',
      data: result,
    });
  },
);
const updateSemesterRegistration = catchAsnyc(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(
        id,
        req.body,
      );

    sendSuccessResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Semester Registration is updated successfully',
      data: result,
    });
  },
);

const deleteSemesterRegistration = catchAsnyc(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result =
      await SemesterRegistrationServices.deleteSemesterRegistrationsFromDB(id);

    sendSuccessResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Semester Registration is deleted successfully',
      data: result,
    });
  },
);
export const SemesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
};
