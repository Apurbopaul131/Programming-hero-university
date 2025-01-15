import bycript from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../../error/appError';
import { User } from '../user/user.model';
import {
  TCreateJwtTokenPayload,
  TLoginUser,
  TPasswordChange,
} from './auth.interface';
import createToken from './auth.uits';

const loginUser = async (payload: TLoginUser) => {
  //check user exist and not delted form collection
  const isUserExist = await User.checkUserExistByCustomId(payload?.id);
  if (!isUserExist) {
    throw new AppError(404, 'User not exist!');
  }
  if (isUserExist?.status === 'blocked') {
    throw new AppError(403, 'User status is blocked!');
  }

  //check if passord matched or not
  const isMatch = await User.checkLoginPasswordMatch(
    payload?.password,
    isUserExist?.password,
  );
  if (!isMatch) {
    throw new AppError(403, 'Password do not matched');
  }

  //create jwt token and send to client
  const jwtPayload: TCreateJwtTokenPayload = {
    userId: isUserExist?.id,
    role: isUserExist?.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_expires_in as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_token_expires_in as string,
  );
  return {
    accessToken,
    refreshToken,
    needsPasswordChange: isUserExist?.needsPasswordChange,
  };
};

const changePassword = async (
  authenticateUserInfo: JwtPayload,
  payload: TPasswordChange,
) => {
  //check user exist and not delted form collection
  const isUserExist = await User.checkUserExistByCustomId(
    authenticateUserInfo?.userId,
  );
  if (!isUserExist) {
    throw new AppError(404, 'User not exist!');
  }
  //check if user is blocked or not
  if (isUserExist?.status === 'blocked') {
    throw new AppError(403, 'User status is blocked!');
  }

  //check if passord matched or not
  const isMatch = await User.checkLoginPasswordMatch(
    payload?.oldPassword,
    isUserExist?.password,
  );
  if (!isMatch) {
    throw new AppError(403, 'Password do not matched');
  }

  //hash password to store into database
  const hasedPassword = await bycript.hash(
    payload?.newPassword,
    Number(config.bycript_salt_rounds),
  );
  await User.findOneAndUpdate(
    { id: authenticateUserInfo?.userId, role: authenticateUserInfo?.role },
    {
      password: hasedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
  return null;
};
const createAccessTokeByrefreshToken = async (token: string) => {
  //step-1:check if token send from client
  if (!token) {
    throw new AppError(403, 'Unauthorized user credential!');
  }
  //step-2:verify the token
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload;
  //destructure the decoded property
  const { userId, iat } = decoded;
  //step-3:check user exist and not delted form collection
  const isUserExist = await User.checkUserExistByCustomId(userId);
  if (!isUserExist) {
    throw new AppError(404, 'User not exist!');
  }
  //check if user is blocked or not
  if (isUserExist?.status === 'blocked') {
    throw new AppError(403, 'User status is blocked!');
  }
  // step-5: Check jwt token is issued before password change
  if (
    isUserExist?.passwordChangedAt &&
    User.isJwtTokenIssuedBeforePasswordchange(
      iat as number,
      isUserExist?.passwordChangedAt,
    )
  ) {
    throw new AppError(403, 'Unauthorized user credential!');
  }
  const jwtPayload: TCreateJwtTokenPayload = {
    userId: isUserExist?.id,
    role: isUserExist?.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_token_expires_in as string,
  );
  return {
    accessToken,
  };
};
export const AuthServices = {
  loginUser,
  changePassword,
  createAccessTokeByrefreshToken,
};
