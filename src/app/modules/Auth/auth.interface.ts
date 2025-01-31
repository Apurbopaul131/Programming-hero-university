export type TLoginUser = {
  id: string;
  password: string;
};
export type TPasswordChange = {
  oldPassword: string;
  newPassword: string;
};
export type TCreateJwtTokenPayload = {
  userId: string;
  role: string;
};
