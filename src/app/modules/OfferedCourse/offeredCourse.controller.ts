import { Request, Response } from 'express';
import catchAsnyc from '../../uits/catchAsync';
import sendSuccessResponse from '../../uits/successResponse';
import { OfferedCourseServices } from './offeredCourse.service';

const createOfferedCourse = catchAsnyc(async (req: Request, res: Response) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(
    req.body,
  );

  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester Registration is created successfully!',
    data: result,
  });
});

const getAllOfferedCourses = catchAsnyc(async (req: Request, res: Response) => {
  const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(
    req.query,
  );
  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'OfferedCourses retrieved successfully !',
    data: result,
  });
});

const getSingleOfferedCourses = catchAsnyc(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(id);
    sendSuccessResponse(res, {
      statusCode: 200,
      success: true,
      message: 'OfferedCourse fetched successfully',
      data: result,
    });
  },
);

const updateOfferedCourse = catchAsnyc(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
    id,
    req.body,
  );
  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Offered Course is updated successfully!',
    data: result,
  });
});

const deleteOfferedCourseFromDB = catchAsnyc(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await OfferedCourseServices.deleteOfferedCourseFromDB(id);
    sendSuccessResponse(res, {
      statusCode: 200,
      success: true,
      message: 'OfferedCourse deleted successfully',
      data: result,
    });
  },
);

export const OfferedCourseControllers = {
  createOfferedCourse,
  updateOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourses,
  deleteOfferedCourseFromDB,
};
