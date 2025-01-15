import { TAcademicSemester } from '../acadecmicSemester/academicSemester.interface';
import { User } from './user.model';

const findLastStudentId = async () => {
  const lastStudentId = await User.findOne(
    { role: 'student' },
    { _id: 0, id: 1 },
  )
    .sort({
      createdAt: -1,
    })
    .lean();
  return lastStudentId?.id;
};
export const generateStudentId = async (payload: TAcademicSemester) => {
  const lastExistingStudentId = await findLastStudentId();
  let initialStudentId = 0;
  const lastExistingSemesterYear = lastExistingStudentId?.substring(0, 4);
  const lastExistingSemesterCode = lastExistingStudentId?.substring(4, 6);
  // console.log('exist sem year', lastExistingSemesterYear);
  // console.log('exist sem code', lastExistingSemesterCode);
  const currentSemesterYear = payload?.year;
  const currentSemesterCode = payload?.code;
  // console.log('current sem year', currentSemesterYear);
  // console.log('current sem code', currentSemesterCode);

  if (
    lastExistingStudentId &&
    lastExistingSemesterYear === currentSemesterYear &&
    lastExistingSemesterCode === currentSemesterCode
  ) {
    initialStudentId = Number(lastExistingStudentId.substring(6));
  }
  let incrementInitialStudentId = (initialStudentId + 1)
    .toString()
    .padStart(4, '0');
  incrementInitialStudentId = `${payload.year}${payload.code}${incrementInitialStudentId}`;
  return incrementInitialStudentId;
};

const findLastFacultyId = async () => {
  const lastFacultyId = await User.findOne(
    { role: 'faculty' },
    { _id: 0, id: 1 },
  )
    .sort({ createdAt: -1 })
    .lean();
  return lastFacultyId?.id ? lastFacultyId?.id.substring(2) : undefined;
};

export const generateFacultyId = async () => {
  let currentId = 0;
  const existLastFacultyId = await findLastFacultyId();
  if (existLastFacultyId) {
    currentId = Number(existLastFacultyId);
  }
  const createdLastFourDigit = (currentId + 1).toString().padStart(4, '0');
  const finalFacultyId = `F-${createdLastFourDigit}`;
  return finalFacultyId;
};

const findLastAdminId = async () => {
  const lastFacultyId = await User.findOne({ role: 'admin' }, { _id: 0, id: 1 })
    .sort({ createdAt: -1 })
    .lean();
  return lastFacultyId?.id ? lastFacultyId?.id.substring(2) : undefined;
};
export const generateAdminId = async () => {
  let currentId = 0;
  const existLastAdminId = await findLastAdminId();
  if (existLastAdminId) {
    currentId = Number(existLastAdminId);
  }
  const createdLastFourDigit = (currentId + 1).toString().padStart(4, '0');
  const finalAdminId = `A-${createdLastFourDigit}`;
  return finalAdminId;
};
