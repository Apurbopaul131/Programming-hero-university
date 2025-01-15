import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middlewires/globalError';
import notFound from './app/middlewires/notFound';
import router from './app/routes';

const app: Application = express();

//parsers middlewires
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ['http://localhost:5173'] }));

//application route
app.use('/api/v1', router);

//checking route
const test = async (req: Request, res: Response) => {
  const a = 'Connected successfully';
  res.send(a);
};

app.get('/', test);
//not found
app.use(notFound);
//global error handler
app.use(globalErrorHandler);
export default app;
