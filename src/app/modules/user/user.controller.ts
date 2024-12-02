import { Request, Response } from 'express';
import { UserServices } from './user.service';

const createUser = async (req: Request, res: Response) => {
  try {
    const { password, student: StudentData } = req.body;
    const result = await UserServices.createStudentToDB(password, StudentData);
    res.status(200).json({
      message: 'Student Created successfully',
      success: true,
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};
export const UserControllers = {
  createUser,
};
