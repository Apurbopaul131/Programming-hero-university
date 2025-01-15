import mongoose from 'mongoose';
import { TErrorSources, TGenericsErrorResponse } from '../interface/error';

const handleMongooseValidationError = (
  err: mongoose.Error.ValidationError,
): TGenericsErrorResponse => {
  const statusCode = 500;
  const message = 'Mongoose validation error!!';
  const errorSources: TErrorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    },
  );
  return {
    statusCode,
    message,
    errorSources,
  };
};
export default handleMongooseValidationError;
