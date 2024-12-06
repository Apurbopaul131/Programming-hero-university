import config from '../../config';
import { TAcademicSemester } from '../acadecmicSemester/academicSemester.interface';
import { AcademicSemister } from '../acadecmicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.uitls';

const createStudentToDB = async (password: string, studentData: TStudent) => {
  //Get student addmistion semster information for generate student id
  const semsterInfoStudent = await AcademicSemister.findOne({
    _id: studentData.addmissionSemester,
  });
  //create a user object and set id,password and role
  const userData: Partial<TUser> = {
    id: generateStudentId(semsterInfoStudent as TAcademicSemester), //generate Student id
    password: password || config.default_password, //set default password when client does not provide password
    role: 'student',
  };
  if (await Student.isUserExists(userData.id as string)) {
    throw new Error('User exist!');
  }
  //create a user
  const newUser = await User.create(userData);

  if (Object.keys(newUser).length) {
    studentData.id = newUser.id; //embedding user id
    studentData.user = newUser._id; //reference user ObjectId
    //create student to databse
    const newStudent = await Student.create(studentData);
    return newStudent;
  }
};
export const UserServices = {
  createStudentToDB,
};
