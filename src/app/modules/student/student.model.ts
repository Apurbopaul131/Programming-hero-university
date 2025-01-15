import mongoose, { Schema } from 'mongoose';
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interface';

const userNameSchema = new mongoose.Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: [true, 'Last Name is required'],
    maxlength: [20, 'Name can not be more than 20 characters'],
  },
});

const guardianSchema = new mongoose.Schema<TGuardian>({
  fatherName: {
    type: String,
    trim: true,
    required: [true, 'Father Name is required'],
  },
  fatherOccupation: {
    type: String,
    trim: true,
    required: [true, 'Father occupation is required'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father Contact No is required'],
  },
  motherName: {
    type: String,
    required: [true, 'Mother Name is required'],
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother occupation is required'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother Contact No is required'],
  },
});
const localGuradianSchema = new mongoose.Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  occupation: {
    type: String,
    required: [true, 'Occupation is required'],
  },
  contactNo: {
    type: String,
    required: [true, 'Contact number is required'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
  },
});

const studentSchema = new mongoose.Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
    },
    name: {
      type: userNameSchema,
      required: [true, 'Name is required'],
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'UserId must be required.'],
      unique: true,
      ref: 'User',
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not a valid gender',
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: Date },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    contactNo: {
      type: String,
      required: [true, 'Contact number is required'],
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
    },
    bloogGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not a valid blood group',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian information is required'],
    },
    localGuardian: {
      type: localGuradianSchema,
      required: [true, 'Local guardian information is required'],
    },
    profileImg: { type: String },
    addmissionSemester: {
      type: Schema.Types.ObjectId,
      required: [true, 'Admission semester must be required'],
      ref: 'AcademicSemester',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic department is required'],
      ref: 'AcademicDepartment',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

//This pre middlewire ensure the user id is unique for every student
// studentSchema.pre('save', async function (next) {
//   const isUserExist = await Student.findOne({ user: this.user });
//   if (isUserExist) {
//     throw new AppError(404, 'Duplicate user!');
//   }
//   next();
// });
//Pre middilwire hooks to prevent retrive deleted student data from database
studentSchema.pre('findOne', async function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('find', async function (next) {
  this.find({ isDeleted: { $eq: false } });
  next();
});
//crete an virtuals fullname
studentSchema.virtual('fullName').get(function () {
  const result = this.name?.middleName
    ? `${this.name?.firstName} ${this.name?.middleName} ${this.name?.lastName}`
    : `${this.name?.firstName} ${this.name?.lastName}`;
  return result;
});
//crate statics method
studentSchema.statics.isUserExists = async function (id: string) {
  const isUserExist = await Student.findById(id);
  return isUserExist;
};
export const Student = mongoose.model<TStudent, StudentModel>(
  'Student',
  studentSchema,
);
