import { model, Schema } from 'mongoose';
import AppError from '../../error/appError';
import { TAcademicFaculty } from './academicFaculty.interface';

const academicFacultySchema = new Schema<TAcademicFaculty>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

academicFacultySchema.pre('save', async function (next) {
  const isAcademicDepartmentExist = await AcademicFaulty.findOne({
    name: this.name,
  });
  if (isAcademicDepartmentExist) {
    throw new AppError(404, 'Academic faculty already exists!!');
  }
  next();
});
academicFacultySchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isAcademicFacultyExist = await AcademicFaulty.findOne(query);
  if (!isAcademicFacultyExist) {
    throw new AppError(404, 'Updated academic faculty does not exist!!');
  }
  next();
});
export const AcademicFaulty = model<TAcademicFaculty>(
  'AcademicFaculty',
  academicFacultySchema,
);
