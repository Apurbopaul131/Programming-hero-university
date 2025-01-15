import express from 'express';
import validateRequest from '../../middlewires/validateRequest';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import { AcademicFacultyValidations } from './academicFaculty.validation';

const router = express.Router();

router.post(
  '/create-academic-faculty',
  validateRequest(
    AcademicFacultyValidations.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.createAcademicFaculty,
);

router.get('/', AcademicFacultyControllers.getAllAcademicFaculty);

router.get('/:facultyId', AcademicFacultyControllers.getSingleAcademicSemester);

router.patch(
  '/:facultyId',
  validateRequest(
    AcademicFacultyValidations.updateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.updateAcademicFaculty,
);

const AcademicFaultyRoutes = router;
export default AcademicFaultyRoutes;
