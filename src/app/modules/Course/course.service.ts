import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/appError';
import { CourseSearchableFields } from './course.constant';
import { TCourse, TCoursefaculty } from './course.interface';
import { Course, CourseFaculty } from './course.model';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCourseFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate({
      path: 'preRequisiteCourses',
      populate: {
        path: 'course',
      },
    }),
    query,
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .skip()
    .limitFields();
  const result = await courseQuery.queryModel;
  return result;
};

const getSingleCouseFromDB = async (courseId: string) => {
  const result = await Course.findById(courseId);
  return result;
};
const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    },
  );
  return result;
};
const updateCouseIntoDB = async (
  courseId: string,
  payload: Partial<TCourse>,
) => {
  const { preRequisiteCourses, ...remainingCoursesData } = payload;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //chek non-primitve fields preRequisiteCourses availabe or not
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      //Fiter isDelted === true fileds form preRequisiteCourses
      const deletedPreRequisitesCoursedId = preRequisiteCourses
        ?.filter(({ course, isDeleted }) => {
          return course && isDeleted;
        })
        .map((el) => el.course);
      //Fiter isDelted === true fileds form preRequisiteCourses
      const addedPreRequisitesCoursedId = preRequisiteCourses?.filter(
        ({ course, isDeleted }) => {
          return course && !isDeleted;
        },
      );
      //update deleted course as preRequisite course
      const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
        courseId,
        {
          $pull: {
            preRequisiteCourses: {
              course: { $in: deletedPreRequisitesCoursedId },
            },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!deletedPreRequisiteCourses) {
        throw new AppError(400, 'Falid to update course!');
      }
      //update added course as preRequisite course
      const newPreRequisiteCourse = await Course.findByIdAndUpdate(
        courseId,
        {
          $addToSet: {
            preRequisiteCourses: {
              $each: addedPreRequisitesCoursedId,
            },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!newPreRequisiteCourse) {
        throw new AppError(400, 'Falid to update course!');
      }
    }
    //update primitive fields to course collection
    const updatePrimitiveFields = await Course.findByIdAndUpdate(
      courseId,
      remainingCoursesData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );
    if (!updatePrimitiveFields) {
      throw new AppError(400, 'Falid to update course!');
    }

    await session.commitTransaction();
    await session.endSession();

    //find deleted course
    const result = await Course.findById(courseId).populate({
      path: 'preRequisiteCourses',
      populate: {
        path: 'course',
        select: 'title prefix',
      },
    });
    return result;
  } catch (err: any) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(err);
  }
};

const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCoursefaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true,
      new: true,
    },
  );
  return result;
};
const removeFacultiesFromCourseFromDB = async (
  id: string,
  payload: Partial<TCoursefaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    {
      new: true,
    },
  );
  return result;
};
export const CourseServices = {
  createCourseIntoDB,
  getAllCourseFromDB,
  getSingleCouseFromDB,
  deleteCourseFromDB,
  updateCouseIntoDB,
  assignFacultiesWithCourseIntoDB,
  removeFacultiesFromCourseFromDB,
};
