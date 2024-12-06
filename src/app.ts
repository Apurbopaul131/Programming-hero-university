import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewires/globalError';
import notFound from './app/middlewires/notFound';
import router from './app/routes';

const app: Application = express();

//parsers middlewires
app.use(express.json());
app.use(cors());

//application route
app.use('/api/v1', router);

//checking route
app.get('/', (req: Request, res: Response) => {
  res.send('Connect successfully');
});
//not found
app.use(notFound);
//global error handler
app.use(globalErrorHandler);
export default app;
