import { model, Schema } from 'mongoose';
import {
  TCourse,
  TCoursefaculty,
  TPreRequisteCourse,
} from './course.interface';

const preRequisiteSchema = new Schema<TPreRequisteCourse>({
  course: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Course',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const courseSchema = new Schema<TCourse>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    prefix: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: Number,
      required: true,
    },
    credit: {
      type: Number,
      required: true,
    },
    preRequisiteCourses: [preRequisiteSchema],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const courseFacultySchema = new Schema<TCoursefaculty>({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    unique: true,
  },
  faculties: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
    },
  ],
});

export const Course = model<TCourse>('Course', courseSchema);
export const CourseFaculty = model<TCoursefaculty>(
  'CourseFaculty',
  courseFacultySchema,
);
