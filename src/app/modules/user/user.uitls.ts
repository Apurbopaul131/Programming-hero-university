import { TAcademicSemester } from '../acadecmicSemester/academicSemester.interface';
export const generateStudentId = (payload: TAcademicSemester) => {
  const initialStudentId = 0;
  let incrementInitialStudentId = (initialStudentId + 1)
    .toString()
    .padStart(4, '0');
  incrementInitialStudentId = `${payload.year}${payload.code}${incrementInitialStudentId}`;
  return incrementInitialStudentId;
};
