import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../error/appError';
import { TAcademicSemester } from '../acadecmicSemester/academicSemester.interface';
import { AcademicSemister } from '../acadecmicSemester/academicSemester.model';
import { AcademicDepartment } from '../academicDepartment/academicDeaprtment.model';
import { Admin } from '../Admin/adimin.model';
import { TFaculty } from '../Faculty/faculty.interface';
import { Faculty } from '../Faculty/faculty.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.uitls';

const createStudentToDB = async (password: string, payload: TStudent) => {
  //Get student addmistion semster information for generate student id
  const semsterInfoStudent = await AcademicSemister.findOne({
    _id: payload.addmissionSemester,
  });
  //create a user object and set id,password and role
  const userData: Partial<TUser> = {
    id: await generateStudentId(semsterInfoStudent as TAcademicSemester), //generate Student id
    password: password || config.default_password, //set default password when client does not provide password
    role: 'student',
  };
  // find academic semester info
  const admissionSemester = await AcademicSemister.findById(
    payload.addmissionSemester,
  );

  if (!admissionSemester) {
    throw new AppError(400, 'Admission semester not found');
  }
  // find academic semester info
  const admissionDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!admissionDepartment) {
    throw new AppError(400, 'Admission department not found');
  }
  //start a session
  const session = await mongoose.startSession();
  //start a transactions
  session.startTransaction();
  try {
    //pass session to operations
    //create a user(Transaction-1)
    const newUser = await User.create([userData], { session }); //return an array
    if (!newUser.length) {
      throw new AppError(400, 'Failed to create user!!');
    }

    payload.id = newUser[0].id; //embedding user id
    payload.user = newUser[0]._id; //reference user ObjectId
    //create student to databse(Transaction-2)
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError(400, 'Failed to create student!!');
    }

    //After complete the transaction to save changes into database
    await session.commitTransaction();
    //end the session
    session.endSession();

    return newStudent;
  } catch (err: any) {
    //If catch erro then abort the transaction
    await session.abortTransaction();
    //end the session
    session.endSession();
    //throw error
    throw new Error(err);
  }
};

const createFacultyToDB = async (password: string, payload: TFaculty) => {
  //crate a object
  const newFacultyData: Partial<TUser> = {
    id: await generateFacultyId(), //generate faculty id
    password: password || config.default_password, //set passsword or defacult password
    role: 'faculty',
  };
  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }
  //start a session
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    //create a faculty as user(tansaction-1)
    const createdFacultyUser = await User.create([newFacultyData], { session });
    if (!createdFacultyUser.length) {
      throw new AppError(400, 'failed to created faculty user');
    }
    payload.id = createdFacultyUser[0].id;
    payload.user = createdFacultyUser[0]._id;
    //created exact faculty(transaction-2)
    const cretatedExactFaculty = await Faculty.create([payload], {
      session,
    });
    if (!cretatedExactFaculty) {
      throw new AppError(400, 'Failed to created faculty');
    }
    //Save the changes
    await session.commitTransaction();
    //end the session
    session.endSession();

    return cretatedExactFaculty;
  } catch (err: any) {
    //If catch error the abort the transaction
    await session.abortTransaction();
    //end the session
    session.endSession();
    throw new Error(err);
  }
};
const createAdminToDB = async (password: string, payload: TFaculty) => {
  // create a user object
  const userData: Partial<TUser> = {
    id: await generateAdminId(),
    password: password || (config.default_password as string), //if password is not given , use deafult password
    role: 'admin', //set student role
  };

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(400, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(400, 'Failed to create admin');
    }
    //commit the changes
    await session.commitTransaction();
    //end the session
    await session.endSession();

    return newAdmin;
  } catch (err: any) {
    //abort the transaction
    await session.abortTransaction();
    //end the transaction
    await session.endSession();
    throw new Error(err);
  }
};

export const UserServices = {
  createStudentToDB,
  createFacultyToDB,
  createAdminToDB,
};
