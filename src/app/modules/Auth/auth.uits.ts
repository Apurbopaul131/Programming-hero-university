import Jwt from 'jsonwebtoken';
import { TCreateJwtTokenPayload } from './auth.interface';

const createToken = (
  payload: TCreateJwtTokenPayload,
  tokenSecret: string,
  expiresIn: string,
) => {
  return Jwt.sign(payload, tokenSecret, {
    expiresIn,
  });
};
export default createToken;
