import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFaulty } from './academicFaculty.model';

const createAcademicFacultyToDB = async (payload: TAcademicFaculty) => {
  const result = await AcademicFaulty.create(payload);
  return result;
};

const getAllAcadimicFacultyFromDB = async () => {
  const result = await AcademicFaulty.find({});
  return result;
};
const getSingleAcademicFacultyFromDB = async (facultyId: string) => {
  const result = await AcademicFaulty.findById(facultyId);
  return result;
};

const updateSingleAcademicFacultyToDB = async (
  facultyId: string,
  payload: TAcademicFaculty,
) => {
  const result = await AcademicFaulty.findByIdAndUpdate(
    { _id: facultyId },
    payload,
    { new: true },
  );
  return result;
};
export const AcademicFacultiesServices = {
  createAcademicFacultyToDB,
  getAllAcadimicFacultyFromDB,
  getSingleAcademicFacultyFromDB,
  updateSingleAcademicFacultyToDB,
};
