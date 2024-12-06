import express from 'express';
import validateRequest from '../../middlewires/validateRequest';
import { studentValidations } from '../student/student.validation';
import { UserControllers } from './user.controller';

const router = express.Router();

router.post(
  '/create-student',
  validateRequest(studentValidations.createStudentValidationSchema),
  UserControllers.createUser,
);

const userRoutes = router;
export default userRoutes;
