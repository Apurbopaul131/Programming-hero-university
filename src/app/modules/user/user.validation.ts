import { z } from 'zod';

//zod validation schema
const UserValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/,
      {
        message:
          'Passoword must be one lowercase, one uppercase, one digit, one special character and must be eight characters.',
      },
    )
    .optional(),
});
const UserValidation = UserValidationSchema;
//export zod validation schema
export default UserValidation;
