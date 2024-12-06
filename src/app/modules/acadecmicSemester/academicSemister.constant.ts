import {
  TAcademicSemesterCode,
  TAcademicSemesterName,
  TMonths,
} from './academicSemester.interface';

export const Months: TMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const SemesterName: TAcademicSemesterName[] = [
  'Autumn',
  'Summar',
  'Fall',
];
export const SemesterCode: TAcademicSemesterCode[] = ['01', '02', '03'];
type TAcademicSemesterNameAndCodeMapping = {
  Autumn: '01';
  Summar: '02';
  Fall: '03';
};
export const AcademicSemesterNameAndCodeMapping: TAcademicSemesterNameAndCodeMapping =
  {
    Autumn: '01',
    Summar: '02',
    Fall: '03',
  };
