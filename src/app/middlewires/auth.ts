import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../error/appError';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
const auth = (...requiredRoles: TUserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    /* 
      step-1:Check if token is send from request headers.
      sterp-2:Verify the jwt token and decoded user information.
      step-3: Check if user is delete and blocked after generate the jwt token.
      step-4: Decoded user information set into req.user
      step-5: Check jwt token is issued before password change
      step-6: check Authorization who are authorize to access the data
    */
    try {
      const token = req.headers.authorization;
      //step-1:check if token send from client
      if (!token) {
        throw new AppError(403, 'Unauthorized user credential!');
      }
      //step-2:verify the token
      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string,
      ) as JwtPayload;
      //destructure the decoded property
      const { userId, role, iat } = decoded;
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
      //step-6:check Authorization who are authorize to access the data
      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(403, 'Unauthorized user credential!');
      }
      req.user = decoded;
      next();
    } catch (err) {
      next(err);
    }
  };
};
export default auth;
