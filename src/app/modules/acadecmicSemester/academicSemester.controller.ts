import { NextFunction, Request, Response } from 'express';
import sendSuccessResponse from '../../uits/successResponse';
import { AcademicSemesterServices } from './academicSemester.service';

const createAcademicSemester = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AcademicSemesterServices.createAcademicSemesterToDB(
      req.body,
    );
    //send response to client
    sendSuccessResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Academic semester created successfully.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllAcademicSemister = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result =
      await AcademicSemesterServices.getAllAcademicSemterterFromDB();
    //send response to client
    sendSuccessResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All academic semester retrived successfully.',
      data: result,
    });
  } catch (err) {
    //send to global err handler
    next(err);
  }
};

const getSingleAcademicSemester = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const semesterId = req.params.semesterId;
    const result =
      await AcademicSemesterServices.getSingleAcademicSemesterFromDB(
        semesterId,
      );
    //send response to client
    sendSuccessResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Academic semester retrived successfully.',
      data: result,
    });
  } catch (err) {
    //send to global err handler
    next(err);
  }
};

const updateAcademicSemester = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const semesterId = req.params.semesterId;
    const result = await AcademicSemesterServices.updateAcadecSemesterToDB(
      semesterId,
      req.body,
    );
    //send response to client
    sendSuccessResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Academic semester updated successfully.',
      data: result,
    });
  } catch (err) {
    //send to global err handler
    next(err);
  }
};
export const AcademicSemisterControllers = {
  createAcademicSemester,
  getAllAcademicSemister,
  getSingleAcademicSemester,
  updateAcademicSemester,
};
