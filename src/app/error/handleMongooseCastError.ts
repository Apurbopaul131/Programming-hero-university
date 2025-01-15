import mongoose from 'mongoose';
import { TErrorSources, TGenericsErrorResponse } from '../interface/error';

const handeMongooseCastError = (
  err: mongoose.Error.CastError,
): TGenericsErrorResponse => {
  const statusCode = 400;
  const message = 'Invalid ID!';
  const errorSources: TErrorSources = [
    {
      path: err?.path,
      message: err?.message,
    },
  ];
  return {
    statusCode,
    message,
    errorSources,
  };
};
export default handeMongooseCastError;
