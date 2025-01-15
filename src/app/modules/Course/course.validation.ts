import { z } from 'zod';

const preRequisiteCouseValidationSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(),
});
const courseValidationSchema = z.object({
  body: z.object({
    course: z.object({
      title: z.string(),
      prefix: z.string(),
      code: z.number(),
      credit: z.number(),
      preRequisiteCourses: z
        .array(preRequisiteCouseValidationSchema)
        .optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});

const updatePreRequisiteCouseValidationSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(),
});
const updateCourseValidationSchema = z.object({
  body: z.object({
    course: z.object({
      title: z.string().optional(),
      prefix: z.string().optional(),
      code: z.number().optional(),
      credit: z.number().optional(),
      preRequisiteCourses: z
        .array(updatePreRequisiteCouseValidationSchema)
        .optional(),
      isDeleted: z.boolean().optional(),
    }),
  }),
});
const facultiesWithCourseValidationSchema = z.object({
  body: z.object({
    faculties: z.array(z.string()),
  }),
});
export const courseValidations = {
  courseValidationSchema,
  updateCourseValidationSchema,
  facultiesWithCourseValidationSchema,
};
