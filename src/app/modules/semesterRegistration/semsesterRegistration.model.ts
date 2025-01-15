import { model, Schema } from 'mongoose';
import { semesterRegistrationStatus } from './semesterRegistration.constant';
import { TSemesterRegistration } from './semeterRegistration.interface';

const semesterRegistrationSchema = new Schema(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: 'AcademicSemester',
    },
    status: {
      type: String,
      enum: {
        values: semesterRegistrationStatus,
        message: '{VALUE} is not supported',
      },
      default: 'UPCOMING',
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    minCredit: {
      type: Number,
      default: 3,
    },
    maxCredit: {
      type: Number,
      default: 15,
    },
  },
  {
    timestamps: true,
  },
);
export const SemesterRegistration = model<TSemesterRegistration>(
  'SemesterRegistration',
  semesterRegistrationSchema,
);
