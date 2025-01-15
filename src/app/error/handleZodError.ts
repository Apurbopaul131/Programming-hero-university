import { ZodError, ZodIssue } from 'zod';
import { TErrorSources, TGenericsErrorResponse } from '../interface/error';

const handleZodError = (err: ZodError): TGenericsErrorResponse => {
  const statusCode = 400;
  const message = 'validation error';
  const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue?.message,
    };
  });
  return {
    statusCode,
    message,
    errorSources,
  };
};
export default handleZodError;
