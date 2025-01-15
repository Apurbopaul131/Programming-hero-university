import { z } from 'zod';
import { Days } from './offeredCourse.constant';

const timeStringSchema = z.string().refine(
  (time) => {
    const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
    return timeRegex.test(time);
  },
  {
    message: 'Invalid time format , expected "HH:MM" in 24 hours format',
  },
);

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      section: z.number(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: timeStringSchema,
      endTime: timeStringSchema,
    })
    .refine(
      (body) => {
        const { startTime, endTime } = body;
        const [startHour, startMinute] = startTime
          .split(':')
          .map((t) => Number(t));
        const [endHour, endMinute] = endTime.split(':').map((t) => Number(t));
        // Compare times
        if (endHour > startHour) {
          return true; // End time is greater
        } else if (endHour === startHour && endMinute > startMinute) {
          return true; // Same hour, but end minute is greater
        }
        return false;
      },
      {
        message: 'Start time should be before End time !',
      },
    ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string(),
      maxCapacity: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: timeStringSchema,
      endTime: timeStringSchema,
    })
    .refine(
      (body) => {
        const { startTime, endTime } = body;
        const [startHour, startMinute] = startTime
          .split(':')
          .map((t) => Number(t));
        const [endHour, endMinute] = endTime.split(':').map((t) => Number(t));
        // Compare times
        if (endHour > startHour) {
          return true; // End time is greater
        } else if (endHour === startHour && endMinute > startMinute) {
          return true; // Same hour, but end minute is greater
        }
        return false;
      },
      {
        message: 'Start time should be before End time !',
      },
    ),
});
export const offeredCourseValidations = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
