import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/appError';
import { AcademicSemister } from '../acadecmicSemester/academicSemester.model';
import { OfferedCourse } from '../OfferedCourse/offeredCourse.model';
import { semesterRegistrationStatusObj } from './semesterRegistration.constant';
import { TSemesterRegistration } from './semeterRegistration.interface';
import { SemesterRegistration } from './semsesterRegistration.model';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;

  //Check there is already UPCOMMING OR ONGOING semester
  const isAlreadyRegisterdOngoingOrUpcommingSemsesterExist =
    await SemesterRegistration.findOne({
      $or: [
        { status: semesterRegistrationStatusObj.UPCOMING },
        { status: semesterRegistrationStatusObj.ONGOING },
      ],
    });
  if (isAlreadyRegisterdOngoingOrUpcommingSemsesterExist) {
    throw new AppError(
      400,
      `There is aready an ${isAlreadyRegisterdOngoingOrUpcommingSemsesterExist.status} registered semester !`,
    );
  }
  //Check academic semester assign for semester registration exist or not in AcademicSemester model or collection
  const isAcademicSemesterExist =
    await AcademicSemister.findById(academicSemester);
  if (!isAcademicSemesterExist) {
    throw new AppError(404, 'Academic semester does not exist!!');
  }

  //check semester registration already done for requested acadecmic semester or not
  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  });
  if (isSemesterRegistrationExists) {
    throw new AppError(409, 'This semester already registerd!!');
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester', 'name year'),
    query,
  )
    .filter()
    .sort()
    .skip()
    .limitFields();

  const result = await semesterRegistrationQuery.queryModel;
  return result;
};
const getSingleSemesterRegistrationsFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);

  return result;
};
const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  /**
   * Step1: Check if the semester is exist
   * Step2: Check if the requested registered semester is exists
   * Step3: If the requested semester registration is ended, we will not update anything
   * Step4: If the requested semester registration is 'UPCOMING', we will let update everything.
   * Step5: If the requested semester registration is 'ONGOING', we will not update anything  except status to 'ENDED'
   * Step6: If the requested semester registration is 'ENDED' , we will not update anything
   *
   * UPCOMING --> ONGOING --> ENDED
   *
   */
  //Check if the requested registered semester is exists
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  const currentSemester = isSemesterRegistrationExists?.status;
  const requestedRegisterdSemester = payload?.status;
  if (!isSemesterRegistrationExists) {
    throw new AppError(400, 'This semester not found!!');
  }
  //If the requested semester registration is ended, we will not update anything
  if (currentSemester === semesterRegistrationStatusObj.ENDED) {
    throw new AppError(400, `This semester already ${currentSemester}`);
  }
  //UPCOMING --> ONGOING --> ENDED
  if (
    currentSemester === semesterRegistrationStatusObj.UPCOMING &&
    requestedRegisterdSemester === semesterRegistrationStatusObj.ENDED
  ) {
    throw new AppError(
      400,
      `You can not directly update status from ${currentSemester} to ${requestedRegisterdSemester}`,
    );
  }
  if (
    currentSemester === semesterRegistrationStatusObj.ONGOING &&
    requestedRegisterdSemester === semesterRegistrationStatusObj.UPCOMING
  ) {
    throw new AppError(
      400,
      `You can not directly update status from ${currentSemester} to ${requestedRegisterdSemester}`,
    );
  }
  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteSemesterRegistrationsFromDB = async (id: string) => {
  const isSemesterRegistrationExist = await SemesterRegistration.findById(id);
  //check if semester registarion exist
  if (!isSemesterRegistrationExist) {
    throw new AppError(404, 'Semester registration not found!');
  }
  //check if semester registration status is UPCOMING
  if (isSemesterRegistrationExist?.status !== 'UPCOMING') {
    throw new AppError(
      400,
      `You can not delete this registerd semester as it is ${isSemesterRegistrationExist?.status}`,
    );
  }
  //start an session
  const session = await mongoose.startSession();
  //start an transaction
  session.startTransaction();
  try {
    //deleted all offered course in delted reques registerd semester
    const deletedOfferedCourses = await OfferedCourse.deleteMany(
      {
        semesterRegistration: id,
      },
      {
        new: true,
        session,
      },
    );
    if (!deletedOfferedCourses) {
      throw new AppError(400, 'Failed to delete semester registration !');
    }

    const deletedRegisteredSemester =
      await SemesterRegistration.findByIdAndDelete(id, {
        new: true,
        session,
      });
    if (!deletedRegisteredSemester) {
      throw new AppError(400, 'Failed to delete semester registration !');
    }

    //save the changes permanently into database
    await session.commitTransaction();
    //end the session
    session.endSession();
    return deletedRegisteredSemester;
  } catch (err: any) {
    //abort the transaction
    await session.abortTransaction();
    //end the transaction
    session.endSession();
    throw new Error(err);
  }
};
export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationsFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationsFromDB,
};
