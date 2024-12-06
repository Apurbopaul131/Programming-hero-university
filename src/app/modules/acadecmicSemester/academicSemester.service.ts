import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemister } from './academicSemester.model';
import { AcademicSemesterNameAndCodeMapping } from './academicSemister.constant';

const createAcademicSemesterToDB = async (payload: TAcademicSemester) => {
  //Check semester name correctly aligned with semester code or not
  if (AcademicSemesterNameAndCodeMapping[payload.name] !== payload.code) {
    throw new Error('Semester code invalid!');
  }
  const result = await AcademicSemister.create(payload);
  return result;
};

const getAllAcademicSemterterFromDB = async () => {
  const result = await AcademicSemister.find({});
  return result;
};

const getSingleAcademicSemesterFromDB = async (semesterId: string) => {
  const result = await AcademicSemister.findById(semesterId);
  return result;
};

const updateAcadecSemesterToDB = async (
  semesterId: string,
  payload: Partial<TAcademicSemester>,
) => {
  //check semester Name and code are correctly mapping or not
  if (
    payload.name &&
    payload.code &&
    AcademicSemesterNameAndCodeMapping[payload.name] !== payload.code
  ) {
    throw new Error('Invalid semester code!');
  }
  const result = await AcademicSemister.findOneAndUpdate(
    { _id: semesterId },
    payload,
    { new: true },
  );
  return result;
};
export const AcademicSemesterServices = {
  createAcademicSemesterToDB,
  getAllAcademicSemterterFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcadecSemesterToDB,
};
