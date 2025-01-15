import express from 'express';
import academicSemesterRoutes from '../modules/acadecmicSemester/academicSemester.route';
import AcademicDepartmentRoutes from '../modules/academicDepartment/academicDepartment.route';
import AcademicFaultyRoutes from '../modules/academicFaculty/academicFaculty.route';
import { AdminRoutes } from '../modules/Admin/admin.route';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { CourseRoutes } from '../modules/Course/course.route';
import { facultyRoutes } from '../modules/Faculty/faculty.route';
import { offeredCourseRoutes } from '../modules/OfferedCourse/offeredCourse.route';
import { semesterRegistrationRoutes } from '../modules/semesterRegistration/semesterRegistration.route';
import studentRoutes from '../modules/student/student.route';
import userRoutes from '../modules/user/user.route';

const router = express.Router();
const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/students',
    route: studentRoutes,
  },
  {
    path: '/academic-semesters',
    route: academicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFaultyRoutes,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoutes,
  },
  {
    path: '/faculties',
    route: facultyRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/courses',
    route: CourseRoutes,
  },
  {
    path: '/semester-registrations',
    route: semesterRegistrationRoutes,
  },
  {
    path: '/offered-courses',
    route: offeredCourseRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
];
moduleRoutes.forEach(({ path, route }) => router.use(path, route));
// router.use('/users', userRoutes);

export default router;
