import { z } from 'zod';
import {
  Months,
  SemesterCode,
  SemesterName,
} from './academicSemister.constant';

const createAcademicSemesterValidationSchema = z.object({
  body: z
    .object({
      name: z.enum([...SemesterName] as [string, ...string[]], {
        message: 'Semester name must be Fall | Autumn | Summer',
      }),
      year: z.string({
        required_error: 'Semester year is required',
        invalid_type_error: 'Semester year must be a string',
      }),
      code: z.enum([...SemesterCode] as [string, ...string[]], {
        message: 'Semester code must be 01 | 02 | 03',
      }),
      startMonth: z.enum([...Months] as [string, ...string[]], {
        message: 'Start month must be contains a month',
      }),
      endMonth: z.enum([...Months] as [string, ...string[]], {
        message: 'End month must be contains a month',
      }),
    })
    .strict(),
});

const updateAcademicSemesterVadationSchema = z.object({
  body: z
    .object({
      name: z
        .enum([...SemesterName] as [string, ...string[]], {
          message: 'Semester name must be Fall | Autumn | Summer',
        })
        .optional(),
      year: z
        .string({
          required_error: 'Semester year is required',
          invalid_type_error: 'Semester year must be a string',
        })
        .optional(),
      code: z
        .enum([...SemesterCode] as [string, ...string[]], {
          message: 'Semester code must be 01 | 02 | 03',
        })
        .optional(),
      startMonth: z
        .enum([...Months] as [string, ...string[]], {
          message: 'Start month must be contains a month',
        })
        .optional(),
      endMonth: z
        .enum([...Months] as [string, ...string[]], {
          message: 'End month must be contains a month',
        })
        .optional(),
    })
    .strict(),
});
export const AcademicSemesterValidations = {
  createAcademicSemesterValidationSchema,
  updateAcademicSemesterVadationSchema,
};
