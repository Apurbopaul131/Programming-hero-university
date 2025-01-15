import bycript from 'bcrypt';
import mongoose from 'mongoose';
import config from '../../config';
import { TUser, UserModel } from './user.interface';

const userSchema = new mongoose.Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: {
      type: Date,
    },
    role: {
      type: String,
      enum: ['admin', 'faculty', 'student'],
    },
    status: {
      type: String,
      enum: ['in-progress', 'blocked'],
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
userSchema.statics.checkUserExistByCustomId = async function (id) {
  const isUserExist = await this.findOne({ id, isDeleted: false }).select(
    '+password',
  );
  return isUserExist;
};
userSchema.statics.checkLoginPasswordMatch = async function (
  plainTextPassword,
  hashPassword,
) {
  const isMatch = await bycript.compare(plainTextPassword, hashPassword);
  return isMatch;
};
userSchema.statics.isJwtTokenIssuedBeforePasswordchange = function (
  jwtTokenIssuedTimestap,
  passwordChageTimestamp,
) {
  console.log(jwtTokenIssuedTimestap);
  const passwordChageTimestampInMiliseccond = new Date(
    passwordChageTimestamp,
  ).getTime();
  const jwtTokenIssuedTimestapInMiliseccond = jwtTokenIssuedTimestap * 1000;
  return (
    passwordChageTimestampInMiliseccond < jwtTokenIssuedTimestapInMiliseccond
  );
};
export const User = mongoose.model<TUser, UserModel>('User', userSchema);
