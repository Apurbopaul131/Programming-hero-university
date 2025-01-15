import { NextFunction, Request, Response } from 'express';
import sendSuccessResponse from '../../uits/successResponse';
import { AcademicFacultiesServices } from './academicFaculty.service';

const createAcademicFaculty = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await AcademicFacultiesServices.createAcademicFacultyToDB(
      req.body,
    );
    //send response to client
    sendSuccessResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Academic faculty created successfully.',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllAcademicFaculty = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result =
      await AcademicFacultiesServices.getAllAcadimicFacultyFromDB();
    //send response to client
    sendSuccessResponse(res, {
      statusCode: 200,
      success: true,
      message: 'All academic faculty retrived successfully.',
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
    const facultyId = req.params.facultyId;
    const result =
      await AcademicFacultiesServices.getSingleAcademicFacultyFromDB(facultyId);
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

const updateAcademicFaculty = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const facultyId = req.params.facultyId;
    const result =
      await AcademicFacultiesServices.updateSingleAcademicFacultyToDB(
        facultyId,
        req.body,
      );
    //send response to client
    sendSuccessResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Academic faculty updated successfully.',
      data: result,
    });
  } catch (err) {
    //send to global err handler
    next(err);
  }
};
export const AcademicFacultyControllers = {
  createAcademicFaculty,
  getAllAcademicFaculty,
  getSingleAcademicSemester,
  updateAcademicFaculty,
};
