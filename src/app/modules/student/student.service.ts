/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/appError';
import { User } from '../user/user.model';
import { studentSearchableFields } from './student.constant';
import { TStudent } from './student.interface';
import { Student } from './student.model';

const getSingleStudentFromDB = async (studentId: string) => {
  const result = await Student.findById(studentId)
    .populate('addmissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const updateSingleStudentIntoDB = async (
  studentId: string,
  payload: Partial<TStudent>,
) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }
  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }
  //check student exist or not
  if (!(await Student.isUserExists(studentId))) {
    throw new AppError(404, 'Student does exist!');
  }
  const result = await Student.findByIdAndUpdate(
    studentId,
    modifiedUpdatedData,
    {
      new: true,
    },
  );
  return result;
};
const deleteSingleStudentFromDB = async (studentId: string) => {
  if (!(await Student.isUserExists(studentId))) {
    throw new AppError(404, 'user or student does not exist!!');
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //transaction-1
    const deletedStudent = await Student.findByIdAndUpdate(
      studentId,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedStudent) {
      throw new AppError(400, 'Failed to delete student!!');
    }
    //take deleted user _id from student user
    const userId = deletedStudent.user;
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedUser) {
      throw new AppError(400, 'Failed to delete user!!');
    }
    await session.commitTransaction();
    session.endSession();
    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(400, 'Failed to delete student');
  }
};

const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(
    Student.find()
      .populate('user')
      .populate('addmissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .limitFields();

  const result = await studentQuery.queryModel;
  return result;

  // const queryObj = { ...query };
  // const searchTerm = query?.searchTerm ? query?.searchTerm : '';
  // const numberOfSort = query?.sort ? (query?.sort as string) : '-createdAt';
  // const numberOfLimit = query?.limit ? Number(query.limit) : 1;
  // const numberOfPage = query?.page ? Number(query.page) : 1;
  // const numberOfSkip =
  //   query?.limit && query?.page ? (numberOfPage - 1) * numberOfLimit : 1;
  // const limitFields = query?.fields
  //   ? (query.fields as string).split(',').join(' ')
  //   : '-__v';
  // console.log(limitFields);

  // const studentSearchableFields = ['email', 'presentAddress', 'name.firstName'];
  // const serachQueryField = studentSearchableFields.map((dynamicField) => {
  //   const returnQuery = {
  //     [dynamicField]: { $regex: searchTerm, $options: 'i' },
  //   };
  //   return returnQuery;
  // });
  /* 
  const exactQuery = { $or:[ { email: {$regx:searchTerm, $options:'i' } },  { presentAddress: {$regx:searchTerm, $options:'i' } }, "name.firstName": {$regx:searchTerm, $options:'i' } }]}
  */
  // const searchQuery = Student.find({ $or: serachQueryField });
  // const excludeQueryFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  // excludeQueryFields.forEach((el: string) => delete queryObj[el]);
  // console.log(query);
  // console.log(queryObj);
  // console.log(numberOfSkip);
  // const filterQuery = searchQuery
  //   .find(queryObj)
  //   .populate('addmissionSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: {
  //       path: 'academicFaculty',
  //     },
  //   });
  // const allowedFields = ['name.firstName', 'email', 'createdAt'];
  // if (
  //   !allowedFields.includes(sort.startsWith('-') ? sort.substring(1) : sort)
  // ) {
  //   throw new AppError(400, 'Invalid sort field');
  // }
  // const sortQuery = filterQuery.sort(numberOfSort);
  // const paginaeQuery = sortQuery.skip(numberOfSkip);
  // const limitQuery = paginaeQuery.limit(numberOfSkip);
  // const fieldQuery = await limitQuery.select(limitFields);
  // fields: 'name,email';  WE ARE ACCEPTING FROM REQUEST
  // fields: 'name email';  HOW IT SHOULD BE
};
export const StudentServices = {
  getSingleStudentFromDB,
  deleteSingleStudentFromDB,
  getAllStudentFromDB,
  updateSingleStudentIntoDB,
};
