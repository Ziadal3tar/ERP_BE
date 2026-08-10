import asyncHandler from "../utils/asyncHandler.js";

import leaveService from "../services/leave.service.js";

import * as response from "../utils/apiResponse.js";

export const createLeave = asyncHandler(async (req, res) => {
  const leave = await leaveService.createLeave(
    req.user._id,

    req.body,
  );

  response.success(
    res,

    leave,

    "Leave request created successfully",

    201,
  );
});

export const createAdminLeave = asyncHandler(async (req, res) => {
  const leave = await leaveService.createLeaveByAdmin(
    req.body,

    req.user._id,
  );

  response.success(
    res,

    leave,

    "Leave created successfully",

    201,
  );
});

export const getMyLeaves = asyncHandler(async (req, res) => {
  const result = await leaveService.getMyLeaves(
    req.user._id,

    req.query,
  );

  response.paginated(
    res,

    result.data,

    result.pagination,
  );
});

export const getLeaves = asyncHandler(async (req, res) => {
  const result = await leaveService.getLeaves(req.query);

  response.paginated(
    res,

    result.data,

    result.pagination,
  );
});

export const getLeaveById = asyncHandler(async (req, res) => {
  const leave = await leaveService.getLeaveById(req.params.id);

  response.success(
    res,

    leave,
  );
});

export const approveLeave = asyncHandler(async (req, res) => {
  const leave = await leaveService.approveLeave(
    req.params.id,

    req.user._id,
  );

  response.success(
    res,

    leave,

    "Leave approved successfully",
  );
});

export const rejectLeave = asyncHandler(async (req, res) => {
  const leave = await leaveService.rejectLeave(
    req.params.id,

    req.body.reason,

    req.user._id,
  );

  response.success(
    res,

    leave,

    "Leave rejected successfully",
  );
});

export const cancelLeave = asyncHandler(async (req, res) => {
  const leave = await leaveService.cancelLeave(
    req.user._id,

    req.params.id,
  );

  response.success(
    res,

    leave,

    "Leave cancelled successfully",
  );
});
