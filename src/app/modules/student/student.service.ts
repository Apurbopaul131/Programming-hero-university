import { Student } from './student.model';

const getSingleStudentFromDB = async (studentId: string) => {
  const result = await Student.findById(studentId);
  return result;
};
const deleteSingleStudentFromDB = async (studentId: string) => {
  const result = await Student.updateOne(
    { id: studentId },
    { isDeleted: true },
  );
  return result;
};

const getAllStudentFromDB = async () => {
  const result = await Student.find({});
  return result;
};
export const StudentServices = {
  getSingleStudentFromDB,
  deleteSingleStudentFromDB,
  getAllStudentFromDB,
};
