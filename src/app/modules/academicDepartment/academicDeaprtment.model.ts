import { model, Schema } from 'mongoose';
import AppError from '../../error/appError';
import { TAcademicDepartment } from './academicDepartment.interface';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AcademicFaculty',
    },
  },
  {
    timestamps: true,
  },
);

// academicDepartmentSchema.pre('save', async function (next) {
//   const isAcademicDepartmentExist = await AcademicDepartment.findOne({
//     name: this.name,
//   });
//   if (isAcademicDepartmentExist) {
//     throw new AppError(404, 'Academic department already exists!!');
//   }
//   next();
// });
academicDepartmentSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isAcademicDepartmentExist = await AcademicDepartment.findOne(query);
  if (!isAcademicDepartmentExist) {
    throw new AppError(404, 'Updated academic department does not exist!!');
  }
  next();
});
export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
