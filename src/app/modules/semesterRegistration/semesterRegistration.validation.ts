import { z } from 'zod';
import { semesterRegistrationStatus } from './semesterRegistration.constant';

const createSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string(),
    status: z
      .enum([...semesterRegistrationStatus] as [string, ...string[]], {
        message: 'Staus must be UPCOMING | ONGOING | ENDED',
      })
      .optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
  }),
});

const upadateSemesterRegistrationValidationSchema = z.object({
  body: z.object({
    academicSemester: z.string().optional(),
    status: z
      .enum([...semesterRegistrationStatus] as [string, ...string[]])
      .optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    minCredit: z.number().optional(),
    maxCredit: z.number().optional(),
  }),
});

export const SemesterRegistrationValidations = {
  createSemesterRegistrationValidationSchema,
  upadateSemesterRegistrationValidationSchema,
};
