import express from 'express';
import auth from '../../middlewires/auth';
import validateRequest from '../../middlewires/validateRequest';
import { adminValidations } from '../Admin/admin.validation';
import { facultyValidations } from '../Faculty/faculty.validation';
import { studentValidations } from '../student/student.validation';
import { UserControllers } from './user.controller';
import { USER_ROLE } from './user.constant';

const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createStudent,
);
router.post(
  '/create-faculty',
  validateRequest(facultyValidations.createFacultyValidationSchema),
  UserControllers.createFaculty,
);
router.post(
  '/create-admin',
  validateRequest(adminValidations.adminValidationSchema),
  UserControllers.createAdmin,
);

const userRoutes = router;
export default userRoutes;
