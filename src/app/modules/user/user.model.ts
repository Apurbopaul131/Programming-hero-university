import bycript from 'bcrypt';
import mongoose from 'mongoose';
import config from '../../config';
import { TUser } from './user.interface';

const userSchema = new mongoose.Schema<TUser>(
  {
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['admin', 'faculty', 'student'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'block'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, //handle createdAt and updatedAt property
  },
);

//excute pre middlewire to hash the password by using bycript
userSchema.pre('save', async function (next) {
  const hashPassword = await bycript.hash(
    this.password,
    Number(config.bycript_salt_rounds),
  );
  //Replace password by hash passowrd
  this.password = hashPassword;
  next();
});

//execute post document middlewire to prevent send password to client
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});
export const UserModel = mongoose.model<TUser>('User', userSchema);
