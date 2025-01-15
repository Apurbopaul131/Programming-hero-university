import catchAsnyc from '../../uits/catchAsync';
import sendSuccessResponse from '../../uits/successResponse';
import { AdminServices } from './admin.service';

const getSingleAdmin = catchAsnyc(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const result = await AdminServices.getSingleAdminFromDB(id);

  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin is retrieved succesfully',
    data: result,
  });
});

const getAllAdmins = catchAsnyc(async (req, res) => {
  const result = await AdminServices.getAllAdminsFromDB(req.query);

  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admins are retrieved succesfully',
    data: result,
  });
});

const updateAdmin = catchAsnyc(async (req, res) => {
  const { id } = req.params;
  const { admin } = req.body;
  const result = await AdminServices.updateAdminIntoDB(id, admin);

  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin is updated succesfully',
    data: result,
  });
});

const deleteAdmin = catchAsnyc(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const result = await AdminServices.deleteAdminFromDB(id);

  sendSuccessResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin is deleted succesfully',
    data: result,
  });
});

export const AdminControllers = {
  getAllAdmins,
  getSingleAdmin,
  deleteAdmin,
  updateAdmin,
};
