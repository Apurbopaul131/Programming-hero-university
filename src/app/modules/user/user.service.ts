import config from '../../config';
import { TStudent } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TUser } from './user.interface';
import { UserModel } from './user.model';

const createStudentToDB = async (password: string, studentData: TStudent) => {
  //create a user object and set id,password and role
  const userData: Partial<TUser> = {
    id: '2030100001',
    password: password || config.default_password, //set default password when client does not provide password
    role: 'student',
  };
  //create a user
  const newUser = await UserModel.create(userData);
  if (Object.keys(newUser).length) {
    studentData.id = newUser.id; //embedding user id
    studentData.user = newUser._id; //reference user ObjectId
    //create student to databse
    const newStudent = await StudentModel.create(studentData);
    return newStudent;
  }
};
export const UserServices = {
  createStudentToDB,
};
