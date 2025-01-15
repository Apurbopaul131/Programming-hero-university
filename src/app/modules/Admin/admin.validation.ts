import { z } from 'zod';
import { BloodGroup, Gender } from './admin.constant';

const userNameValidationSchema = z.object({
  firstName: z.string().max(20, { message: 'Must be 20  characters long' }),
  middleName: z.string().optional(),
  lastName: z.string().max(20, { message: 'Must be 20  characters long' }),
});

const adminValidationSchema = z.object({
  body: z.object({
    password: z
      .string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/,
        {
          message:
            'Passoword must be one lowercase, one uppercase, one digit, one special character and must be eight characters.',
        },
      ),
    admin: z.object({
      designation: z.string({
        required_error: 'designation is required',
        invalid_type_error: 'designation must be a string',
      }),
      name: userNameValidationSchema,
      gender: z.enum([...Gender] as [string, ...string[]], {
        message: 'The gender value must be male | female | other',
      }),
      dateOfBirth: z
        .string({
          required_error: 'dateOfBirth is required',
          invalid_type_error: 'dateOfBirth must be a string',
        })
        .optional(),
      email: z.string().email(),
      contactNo: z.string({
        required_error: 'Contact Number is required',
        invalid_type_error: 'Contact Number must be a string',
      }),
      bloogGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z.string(),
      permanentAddress: z.string(),
      profileImg: z.string(),
    }),
  }),
});

const updateNameValidationSchema = z.object({
  firstName: z
    .string()
    .max(20, { message: 'Must be 20  characters long' })
    .optional(),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .max(20, { message: 'Must be 20  characters long' })
    .optional(),
});
const updateAdminValidationSchema = z.object({
  body: z.object({
    admin: z.object({
      designation: z
        .string({
          required_error: 'designation is required',
          invalid_type_error: 'designation must be a string',
        })
        .optional(),
      name: updateNameValidationSchema.optional(),
      gender: z
        .enum([...Gender] as [string, ...string[]], {
          message: 'The gender value must be male | female | other',
        })
        .optional(),
      dateOfBirth: z
        .string({
          required_error: 'dateOfBirth is required',
          invalid_type_error: 'dateOfBirth must be a string',
        })
        .optional(),
      email: z.string().email().optional(),
      contactNo: z
        .string({
          required_error: 'Contact Number is required',
          invalid_type_error: 'Contact Number must be a string',
        })
        .optional(),
      bloogGroup: z.enum([...BloodGroup] as [string, ...string[]]).optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      profileImg: z.string().optional(),
    }),
  }),
});
export const adminValidations = {
  adminValidationSchema,
  updateAdminValidationSchema,
};
