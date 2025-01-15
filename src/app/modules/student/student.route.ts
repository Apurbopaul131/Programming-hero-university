import express from 'express';
import auth from '../../middlewires/auth';
import validateRequest from '../../middlewires/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { StudentControllers } from './student.controller';
import { studentValidations } from './student.validation';

const router = express.Router();

router.get('/:id', StudentControllers.getSingleStudent);
router.delete('/:id', StudentControllers.deleteSingleStudent);
router.patch(
  '/:id',
  validateRequest(studentValidations.updateStudentValidationSchema),
  StudentControllers.updateSingleStudent,
);
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.student),
  StudentControllers.getAllStudent,
);
const studentRoutes = router;
export default studentRoutes;
