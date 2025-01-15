import { AcademicDepartment } from './academicDeaprtment.model';
import { TAcademicDepartment } from './academicDepartment.interface';

const createAcademicDepartmentToDB = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload);
  return result;
};

const getAllAcadimicDepartmentFromDB = async () => {
  const result = await AcademicDepartment.find({}).populate(
    'academicFaculty',
    'name',
  );
  return result;
};
const getSingleAcademicDepartmentFromDB = async (departmentId: string) => {
  const result = await AcademicDepartment.findById(departmentId).populate(
    'academicFaculty',
    'name',
  );
  return result;
};

const updateSingleAcademicDepartmentToDB = async (
  departmentId: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartment.findOneAndUpdate(
    { _id: departmentId },
    payload,
    { new: true },
  );
  return result;
};
export const AcademicDepartmentServices = {
  createAcademicDepartmentToDB,
  getAllAcadimicDepartmentFromDB,
  getSingleAcademicDepartmentFromDB,
  updateSingleAcademicDepartmentToDB,
};
