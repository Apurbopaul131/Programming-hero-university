import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/appError';
import { User } from '../user/user.model';
import { FacultySearchableFields } from './faculty.constant';
import { TFaculty } from './faculty.interface';
import { Faculty } from './faculty.model';

const getSingleFacultyFromDB = async (studentId: string) => {
  const result = await Faculty.findById(studentId).populate({
    path: 'academicDepartment',
    select: 'name',
    populate: {
      path: 'academicFaculty',
      select: 'name',
    },
  });
  return result;
};

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  //   const result = await Faculty.find({}).populate({
  //     path: 'academicDepartment',
  //     select: 'name',
  //     populate: {
  //       path: 'academicFaculty',
  //       select: 'name',
  //     },
  //   });
  const facultyQuery = new QueryBuilder(
    Faculty.find().populate({
      path: 'academicDepartment',
      select: 'name',
      populate: {
        path: 'academicFaculty',
        select: 'name',
      },
    }),
    query,
  )
    .search(FacultySearchableFields)
    .filter()
    .sort()
    .skip()
    .limit()
    .limitFields();
  const result = await facultyQuery.queryModel;
  return result;
};
const updateFacultyIntoDB = async (
  facultyId: string,
  payload: Partial<TFaculty>,
) => {
  /* 
  Client data needs to convert:
  {
    "name.firstName":"Apubo",
    "name.lastName":"Paul",
    "designation":"Professor"
    ......
    ......
  }
  */
  //destucture primitive and non-primitive field
  const { name, ...remianingFacultyProperties } = payload;
  const modifiedUpdatedFacultyData: Record<string, unknown> = {
    ...remianingFacultyProperties,
  };
  if (!(await Faculty.isUserExists(facultyId))) {
    throw new AppError(404, 'Faculty member does not exist');
  }
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedFacultyData[`name.${key}`] = value;
    }
  }
  const result = await Faculty.findByIdAndUpdate(
    facultyId,
    modifiedUpdatedFacultyData,
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};
const deleteFacultyFromDB = async (facultyId: string) => {
  if (!(await Faculty.isUserExists(facultyId))) {
    throw new AppError(404, 'Faculty does not exist!');
  }
  //start a session
  const session = await mongoose.startSession();
  //start a taransaction
  session.startTransaction();
  try {
    //Deleted data from user model(Transaction-1)
    const deletedFromFaculty = await Faculty.findByIdAndUpdate(
      facultyId,
      { isDeleted: true },
      { new: true, session },
    );
    // get user _id from deletedFaculty
    const userId = deletedFromFaculty?.user;
    //Deleted data from user model(Transaction-2)
    const deletedFromUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );
    if (!deletedFromUser) {
      throw new AppError(400, 'Failed to delte user!');
    }
    //Check faculty deleted or not
    if (!deletedFromFaculty) {
      throw new AppError(400, 'Failed to delete faculty!');
    }
    //save the changes permanently
    await session.commitTransaction();
    //end the session
    session.endSession();
    return deletedFromFaculty;
  } catch (err: any) {
    //abort transaction
    await session.abortTransaction();
    //end the session
    session.endSession();
    throw new Error(err);
  }
};
export const FacultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateFacultyIntoDB,
  deleteFacultyFromDB,
};
