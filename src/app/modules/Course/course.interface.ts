import { Types } from 'mongoose';

export type TPreRequisteCourse = {
  course: Types.ObjectId;
  isDeleted: boolean;
};
export type TCourse = {
  title: string;
  prefix: string;
  code: number;
  credit: number;
  preRequisiteCourses?: [TPreRequisteCourse];
  isDeleted: boolean;
};
export type TCoursefaculty = {
  course: Types.ObjectId;
  faculties: [Types.ObjectId];
};
