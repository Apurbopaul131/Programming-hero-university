export type TUser = {
  id: string;
  password: string;
  needsPasswordChange: boolean;
  role: 'admin' | 'faculty' | 'student';
  status: 'in-progress' | 'block';
  isDeleted: boolean;
};
