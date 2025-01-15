import { TErrorSources, TGenericsErrorResponse } from '../interface/error';

const handleDuplicateKeyError = (err: any): TGenericsErrorResponse => {
  const statusCode = 400;
  const message = 'Duplicate key error';
  const errorSources: TErrorSources = [
    {
      path: '',
      message: err?.errorResponse?.errmsg,
    },
  ];
  return {
    statusCode,
    message,
    errorSources,
  };
};
export default handleDuplicateKeyError;
