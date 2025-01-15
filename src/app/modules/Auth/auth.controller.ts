import { Request, Response } from 'express';
import config from '../../config';
import catchAsnyc from '../../uits/catchAsync';
import sendSuccessResponse from '../../uits/successResponse';
import { AuthServices } from './auth.service';

const loginUser = catchAsnyc(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken, needsPasswordChange } = result;
  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
  });
  //send response to client
  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully',
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});
const changePassword = catchAsnyc(async (req: Request, res: Response) => {
  const result = await AuthServices.changePassword(req.user, req.body);
  //send response to client
  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password updated successfully',
    data: result,
  });
});
const createAccessTokeByrefreshToken = catchAsnyc(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;
    const result =
      await AuthServices.createAccessTokeByrefreshToken(refreshToken);
    //send response to client
    sendSuccessResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Access token is retrieved succesfully!',
      data: result,
    });
  },
);
export const AuthControllers = {
  loginUser,
  changePassword,
  createAccessTokeByrefreshToken,
};
