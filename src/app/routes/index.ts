import express from 'express';
import academicSemesterRoutes from '../modules/acadecmicSemester/academicSemester.route';
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
];
moduleRoutes.forEach(({ path, route }) => router.use(path, route));
// router.use('/users', userRoutes);

export default router;
