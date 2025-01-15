import express from 'express';
import validateRequest from '../../middlewires/validateRequest';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';

const router = express.Router();

router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistration,
);
router.get(
  '/:id',
  SemesterRegistrationControllers.getSingleSemesterRegistration,
);
router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationValidations.upadateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateSemesterRegistration,
);
router.get('/', SemesterRegistrationControllers.getAllSemesterRegistrations);
router.delete(
  '/:id',
  SemesterRegistrationControllers.deleteSemesterRegistration,
);
export const semesterRegistrationRoutes = router;
