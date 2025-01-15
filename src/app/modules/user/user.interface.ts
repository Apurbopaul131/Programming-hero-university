/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constant';

export interface TUser {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  passwordChangedAt: Date;
  role: 'admin' | 'faculty' | 'student';
  status: 'in-progress' | 'blocked';
  isDeleted: boolean;
}

export interface UserModel extends Model<TUser> {
  checkUserExistByCustomId(id: string): Promise<TUser>;
  checkLoginPasswordMatch(
    plainTextPassword: string,
    hashPassword: string,
  ): Promise<boolean>;
  isJwtTokenIssuedBeforePasswordchange(
    jwtTokenIssuedTimestap: number,
    passwordChageTimestamp: Date,
  ): boolean;
}
export type TUserRole = keyof typeof USER_ROLE;
