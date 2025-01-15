import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/appError';
import { User } from '../user/user.model';
import { Admin } from './adimin.model';
import { AdminSearchableFields } from './admin.constant';
import { TAdmin } from './admin.interface';

const getAllAdminsFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find(), query)
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .skip()
    .limit()
    .limitFields();

  const result = await adminQuery.queryModel;
  return result;
};

const getSingleAdminFromDB = async (id: string) => {
  const result = await Admin.findById(id);
  return result;
};

const updateAdminIntoDB = async (id: string, payload: Partial<TAdmin>) => {
  const { name, ...remainingAdminData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingAdminData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  if (!(await Admin.isUserExists(id))) {
    throw new AppError(404, 'Admin does not exist!');
  }
  const result = await Admin.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteAdminFromDB = async (id: string) => {
  if (!(await Admin.isUserExists(id))) {
    throw new AppError(404, 'Admin does not exist!');
  }
  //start a session
  const session = await mongoose.startSession();
  //start transaction
  session.startTransaction();

  try {
    //pass session
    const deletedAdmin = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedAdmin) {
      throw new AppError(400, 'Failed to delete student');
    }

    // get user _id from deletedAdmin
    const userId = deletedAdmin.user;

    const deletedUser = await User.findOneAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(400, 'Failed to delete user');
    }
    //save changes permanently
    await session.commitTransaction();
    //end the session

    await session.endSession();

    return deletedAdmin;
  } catch (err: any) {
    //abort the transaction
    await session.abortTransaction();
    //end the transaction
    await session.endSession();
    throw new Error(err);
  }
};

export const AdminServices = {
  getAllAdminsFromDB,
  getSingleAdminFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
};
