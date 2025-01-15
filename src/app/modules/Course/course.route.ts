import express from 'express';
import validateRequest from '../../middlewires/validateRequest';
import { CourseControllers } from './course.controller';
import { courseValidations } from './course.validation';

const router = express.Router();

router.post(
  '/create-course',
  validateRequest(courseValidations.courseValidationSchema),
  CourseControllers.createCourse,
);

router.get('/:id', CourseControllers.getSingleCourse);
router.patch(
  '/:id',
  validateRequest(courseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

router.delete('/:id', CourseControllers.deleteCourse);

// router.delete(
//   '/:courseId/remove-faculties',
//   validateRequest(CourseValidations.facultiesWithCourseValidationSchema),
//   CourseControllers.removeFacultiesFromCourse,
// );

router.get('/', CourseControllers.getAllCourse);

//assign faculties
router.put(
  '/:courseId/assign-faculties',
  validateRequest(courseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultiesWithCourse,
);
router.delete(
  '/:courseId/remove-faculties',
  validateRequest(courseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesFromCourse,
);

export const CourseRoutes = router;
