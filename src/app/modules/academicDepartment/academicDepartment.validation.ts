import { z } from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Academic Department is required',
      invalid_type_error: 'Academic Department is must be string',
    }),
    academicFaculty: z.string({
      required_error: 'Academic faculty is required',
      invalid_type_error: 'Academic faculty is must be string',
    }),
  }),
});

const updateAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Academic Department is required',
        invalid_type_error: 'Academic Department is must be string',
      })
      .optional(),
    academicFaculty: z
      .string({
        required_error: 'Academic faculty is required',
        invalid_type_error: 'Academic faculty is must be string',
      })
      .optional(),
  }),
});

export const AcademicDepartmentValidations = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
