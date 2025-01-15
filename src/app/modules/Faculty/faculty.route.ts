import express from 'express';
import auth from '../../middlewires/auth';
import validateRequest from '../../middlewires/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { FacultyConterollers } from './faculty.controller';
import { facultyValidations } from './faculty.validation';

const router = express.Router();
router.get(
  '/',
  auth(USER_ROLE.admin),
  FacultyConterollers.getAllFacultyMembers,
);
router.get('/:id', FacultyConterollers.getSingleFaculty);
router.patch(
  '/:id',
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  FacultyConterollers.updateFaculty,
);
router.delete('/:id', FacultyConterollers.deleteFaculty);

export const facultyRoutes = router;
