import { model, Schema } from 'mongoose';
import AppError from '../../error/appError';
import { TAcademicSemester } from './academicSemester.interface';
import {
  Months,
  SemesterCode,
  SemesterName,
} from './academicSemister.constant';

export const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      required: true,
      enum: SemesterName,
    },
    year: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      enum: SemesterCode,
      required: true,
    },
    startMonth: {
      type: String,
      enum: Months,
      required: true,
    },
    endMonth: {
      type: String,
      enum: Months,
    },
  },
  {
    timestamps: true,
  },
);

//Pre hook middlewire to prevent same semester name in a same year
academicSemesterSchema.pre('save', async function (next) {
  const isSemesterExist = await AcademicSemister.findOne({
    name: this.name,
    year: this.year,
  });

  if (isSemesterExist) {
    throw new AppError(404, 'Semester already exists!');
  }
  next();
});

academicSemesterSchema.pre('findOneAndUpdate', async function (next) {
  const query = this.getQuery();
  const isAcademicSemesterExist = await AcademicSemister.findOne(query);
  if (!isAcademicSemesterExist) {
    throw new AppError(404, 'Updated academic semester does not exist!!');
  }
  next();
});
export const AcademicSemister = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
