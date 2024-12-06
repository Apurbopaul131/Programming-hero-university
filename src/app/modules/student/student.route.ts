import express from 'express';
import { StudentControllers } from './student.controller';

const router = express.Router();

router.get('/:studentId', StudentControllers.getSingleStudent);
router.delete('/:studentId', StudentControllers.deleteSingleStudent);
router.get('/', StudentControllers.getAllStudent);
const studentRoutes = router;
export default studentRoutes;
