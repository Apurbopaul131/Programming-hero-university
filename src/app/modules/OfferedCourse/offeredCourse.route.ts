import express from 'express';
import validateRequest from '../../middlewires/validateRequest';
import { OfferedCourseControllers } from './offeredCourse.controller';
import { offeredCourseValidations } from './offeredCourse.validation';

const router = express.Router();
router.post(
  '/create-offered-course',
  validateRequest(offeredCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);
router.get('/', OfferedCourseControllers.getAllOfferedCourses);
router.get('/:id', OfferedCourseControllers.getSingleOfferedCourses);
router.patch(
  '/:id',
  validateRequest(offeredCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
);
router.delete('/:id', OfferedCourseControllers.deleteOfferedCourseFromDB);
export const offeredCourseRoutes = router;
