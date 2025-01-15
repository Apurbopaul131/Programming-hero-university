import { NextFunction, Request, Response } from 'express';
import sendSuccessResponse from '../../uits/successResponse';
import { AcademicDepartmentServices } from './academicDepartment.service';

const createAcademicDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result =
      await AcademicDepartmentServices.createAcademicDepartmentToDB(req.body);
    //send response to client
    sendSuccessResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Academic department created successfully.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllAcademicDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result =
      await AcademicDepartmentServices.getAllAcadimicDepartmentFromDB();
    //send response to client
    sendSuccessResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All academic department retrived successfully.',
      data: result,
    });
  } catch (err) {
    //send to global err handler
    next(err);
  }
};

const getSingleAcademicDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const departmentId = req.params.departmentId;
    const result =
      await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(
        departmentId,
      );
    //send response to client
    sendSuccessResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Academic department retrived successfully.',
      data: result,
    });
  } catch (err) {
    //send to global err handler
    next(err);
  }
};

const updateAcademicDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const departmentId = req.params.departmentId;
    const result =
      await AcademicDepartmentServices.updateSingleAcademicDepartmentToDB(
        departmentId,
        req.body,
      );
    //send response to client
    sendSuccessResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Academic department updated successfully.',
      data: result,
    });
  } catch (err) {
    //send to global err handler
    next(err);
  }
};
export const AcademicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
};
