import express from 'express';
import { UserControllers } from './user.controller';

const router = express.Router();

router.post('/create-student', UserControllers.createUser);
const userRoutes = router;
export default userRoutes;
