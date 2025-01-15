import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/appError';
import { AcademicDepartment } from '../academicDepartment/academicDeaprtment.model';
import { AcademicFaulty } from '../academicFaculty/academicFaculty.model';
import { Course, CourseFaculty } from '../Course/course.model';
import { Faculty } from '../Faculty/faculty.model';
import { SemesterRegistration } from '../semesterRegistration/semsesterRegistration.model';
import { TAssignSchedules, TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { hasFacultyConflict } from './offeredCourse.uitls';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;
  /**
   * Step 1: check if the semester registration id is exists!
   * Step 2: check if the academic faculty id is exists!
   * Step 3: check if the academic department id is exists!
   * Step 4: check if the course id is exists!
   * Step 5: check if the faculty id is exists!
   * Step 6: check if the department is belong to the  faculty
   * Step 7: check if the same offered course same section in same registered semester exists
   * Step 8: get the schedules of the faculties
   * Step 9: check if the faculty is available at that time. If not then throw error
   * Step 10: create the offered course
   */

  //check if the semester registration id is exists!
  const isSemesterRegistrationExits =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExits) {
    throw new AppError(404, 'Semester registration not found !');
  }
  //take acadecmic semester from semester registration
  const academicSemester = isSemesterRegistrationExits?.academicSemester;
  //check if the academic faculty id is exists!
  const isAcademicFacultyExits = await AcademicFaulty.findById(academicFaculty);

  if (!isAcademicFacultyExits) {
    throw new AppError(404, 'Academic Faculty not found !');
  }
  //check if the academic department id is exists!
  const isAcademicDepartmentExits =
    await AcademicDepartment.findById(academicDepartment);

  if (!isAcademicDepartmentExits) {
    throw new AppError(404, 'Academic Department not found !');
  }

  //check if the course id is exists!
  const isCoursetExits = await Course.findById(course);

  if (!isCoursetExits) {
    throw new AppError(404, 'Couse not found !');
  }

  //check if the faculty id is exists!
  const isFacultyExits = await Faculty.findById(faculty);

  if (!isFacultyExits) {
    throw new AppError(404, 'Faculty not found !');
  }

  //check if the department is belong to the  faculty
  const isDepartmentBelongsToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty: academicFaculty,
  });
  if (!isDepartmentBelongsToFaculty) {
    throw new AppError(
      400,
      `This ${isAcademicDepartmentExits.name} does not belongs to ${isAcademicFacultyExits.name}`,
    );
  }

  // check if the same offered course same section in same registered semester exists

  const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });

  if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      400,
      `Offered course with same section is already exist!`,
    );
  }

  //check if faculty is assigned for requested course
  const isFaculyAssignedForReqCourseExist = await CourseFaculty.findOne({
    course,
    faculties: { $in: [faculty] },
  });
  if (!isFaculyAssignedForReqCourseExist) {
    throw new AppError(
      404,
      `${isFacultyExits.name.firstName} ${isFacultyExits.name.lastName} is not assign for course ${isCoursetExits.title}! please assign faculy for course ${isCoursetExits.title}`,
    );
  }
  //get the Schedules of the faculty
  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: [days] },
  }).select('days startTime endTime');
  const newSchedules = {
    days,
    startTime,
    endTime,
  };
  //check faculty confilct for same day and same time class because one faculty does not take class at same day and same time.
  if (hasFacultyConflict(assignedSchedules, newSchedules)) {
    throw new AppError(
      409,
      `Faculty ${isFacultyExits?.name} is not available for that time! pleaase choose another day or time.`,
    );
  }
  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
    .filter()
    .sort()
    .skip()
    .limitFields();

  const result = await offeredCourseQuery.queryModel;
  return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const offeredCourse = await OfferedCourse.findById(id);

  if (!offeredCourse) {
    throw new AppError(404, 'Offered Course not found');
  }

  return offeredCourse;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<
    TOfferedCourse,
    'days' | 'startTime' | 'endTime' | 'faculty' | 'maxCapacity'
  >,
) => {
  /*
  step-1:Check if  offered couse exist
  step-2: Check if faculy exist
  step-3: check if faculty is assigned for requested course
  step-4:Check if semesterRegistrtion is UPCOMMING
  step-5: Check if any faculty time  confliction occured or not
  */
  const { faculty, days, startTime, endTime } = payload;
  //Check if  offered couse exist
  const isOfferedCourseExist = await OfferedCourse.findById(id);
  if (!isOfferedCourseExist) {
    throw new AppError(404, 'Offerd course not found!');
  }

  //Check if faculy exist
  const isFacultyExist = await Faculty.findById(payload?.faculty);
  if (!isFacultyExist) {
    throw new AppError(404, 'Faculty not found!');
  }

  //check if faculty is assigned for requested course
  const isFaculyAssignedForReqCourseExist = await CourseFaculty.findOne({
    course: isOfferedCourseExist?.course,
    faculties: { $in: [faculty] },
  });
  if (!isFaculyAssignedForReqCourseExist) {
    throw new AppError(
      404,
      `${isFacultyExist.name.firstName} ${isFacultyExist.name.lastName} is not assign for course ! please assign faculy for course`,
    );
  }
  //Take semester registration from offered course
  const semesterRegistration = isOfferedCourseExist?.semesterRegistration;
  //Check if semesterRegistrtion is UPCOMMING
  const isSemsesterRegistrationExist =
    await SemesterRegistration.findById(semesterRegistration);
  if (isSemsesterRegistrationExist?.status !== 'UPCOMING') {
    throw new AppError(
      400,
      `You can not update this offered course as it is ${isSemsesterRegistrationExist?.status}`,
    );
  }

  //get the Schedules of the faculty
  const assignedSchedules: TAssignSchedules[] = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: [days] },
  }).select('days startTime endTime');
  const newSchedules: TAssignSchedules = {
    days,
    startTime,
    endTime,
  };
  //check faculty confilct for same day and same time class because one faculty does not take class at same day and same time.
  if (hasFacultyConflict(assignedSchedules, newSchedules)) {
    throw new AppError(
      409,
      `Faculty ${isFacultyExist?.name} is not available for that time! pleaase choose another day or time.`,
    );
  }
  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the semester registration status is upcoming
   * Step 3: delete the offered course
   */
  const isOfferedCourseExists = await OfferedCourse.findById(id);

  if (!isOfferedCourseExists) {
    throw new AppError(404, 'Offered Course not found');
  }

  const semesterRegistation = isOfferedCourseExists.semesterRegistration;

  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistation).select('status');

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      400,
      `Offered course can not update ! because the semester ${semesterRegistrationStatus}`,
    );
  }

  const result = await OfferedCourse.findByIdAndDelete(id);

  return result;
};
export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  updateOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  deleteOfferedCourseFromDB,
};
