import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import userRoutes from './app/modules/user/user.route';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

//users route
app.use('/api/v1/users', userRoutes);

//checking route
app.get('/', (req: Request, res: Response) => {
  res.send('Connect successfully');
});
export default app;
