import { TAssignSchedules } from './offeredCourse.interface';

export const hasFacultyConflict = (
  assignSchedules: TAssignSchedules[],
  newSchedules: TAssignSchedules,
) => {
  for (const existingSchedule of assignSchedules) {
    const existingStartTime = `1970-01-01T${existingSchedule.startTime}`;
    const existingEndTime = `1970-01-01T${existingSchedule.endTime}`;
    const newStartTime = `1970-01-01T${newSchedules.startTime}`;
    const newEndTime = `1970-01-01T${newSchedules.endTime}`;
    //10:30-12.30
    //9:30-11:30
    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true;
    }
  }
  return false;
};
