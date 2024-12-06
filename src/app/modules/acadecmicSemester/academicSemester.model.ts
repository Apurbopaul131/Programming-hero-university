import { model, Schema } from 'mongoose';
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

//Pre hook middlewire to prevent samename in a same year
academicSemesterSchema.pre('save', async function (next) {
  const isSemesterExist = await AcademicSemister.findOne({
    name: this.name,
    year: this.year,
  });

  if (isSemesterExist) {
    throw new Error('Semester already exists!');
  }
  next();
});
export const AcademicSemister = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
