import express from 'express';
import validateRequest from '../../middlewires/validateRequest';
import { AcademicSemisterControllers } from './academicSemester.controller';
import { AcademicSemesterValidations } from './academicSemister.validation';

const router = express.Router();

router.post(
  '/create-academic-semester',
  validateRequest(
    AcademicSemesterValidations.createAcademicSemesterValidationSchema,
  ),
  AcademicSemisterControllers.createAcademicSemester,
);
//Retrive all academic semester from DB
router.get('/', AcademicSemisterControllers.getAllAcademicSemister);
//Retrive single academic Semester
router.get(
  '/:semesterId',
  AcademicSemisterControllers.getSingleAcademicSemester,
);
//Update single academic semester from DB
router.patch(
  '/:semesterId',
  validateRequest(
    AcademicSemesterValidations.updateAcademicSemesterVadationSchema,
  ),
  AcademicSemisterControllers.updateAcademicSemester,
);
const academicSemesterRoutes = router;
export default academicSemesterRoutes;
