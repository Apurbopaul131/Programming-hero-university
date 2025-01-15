import catchAsnyc from '../../uits/catchAsync';
import sendSuccessResponse from '../../uits/successResponse';
import { CourseServices } from './course.service';

const createCourse = catchAsnyc(async (req, res) => {
  const { course } = req.body;
  const result = await CourseServices.createCourseIntoDB(course);

  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Course is created succesfully',
    data: result,
  });
});
const getAllCourse = catchAsnyc(async (req, res) => {
  const query = req.query;
  const result = await CourseServices.getAllCourseFromDB(query);

  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Courses are retrived succesfully',
    data: result,
  });
});
const getSingleCourse = catchAsnyc(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.getSingleCouseFromDB(id);

  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Course is retrived succesfully',
    data: result,
  });
});
const deleteCourse = catchAsnyc(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourseFromDB(id);

  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Course is deleted succesfully',
    data: result,
  });
});
const updateCourse = catchAsnyc(async (req, res) => {
  const { id } = req.params;
  const { course } = req.body;
  const result = await CourseServices.updateCouseIntoDB(id, course);

  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Course is updated succesfully',
    data: result,
  });
});

const assignFacultiesWithCourse = catchAsnyc(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;

  const result = await CourseServices.assignFacultiesWithCourseIntoDB(
    courseId,
    faculties,
  );

  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculties assigned  succesfully',
    data: result,
  });
});
const removeFacultiesFromCourse = catchAsnyc(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;

  const result = await CourseServices.removeFacultiesFromCourseFromDB(
    courseId,
    faculties,
  );

  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculties removed  succesfully',
    data: result,
  });
});
export const CourseControllers = {
  createCourse,
  getAllCourse,
  getSingleCourse,
  deleteCourse,
  updateCourse,
  assignFacultiesWithCourse,
  removeFacultiesFromCourse,
};
