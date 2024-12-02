import dotenv from 'dotenv';
import pathModule from 'path';

//add path
dotenv.config({ path: pathModule.join(process.cwd(), '.env') });

//export port and database url
export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  default_password: process.env.DEFAULT_PASSWORD,
  bycript_salt_rounds: process.env.BYCRIPT_SALT_ROUNDS,
};
