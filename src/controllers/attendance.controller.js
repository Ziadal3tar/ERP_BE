import asyncHandler from "../utils/asyncHandler.js";

import attendanceService from "../services/attendance.service.js";
import * as response from "../utils/apiResponse.js";

export const checkIn = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.checkIn(
    req.user._id,

    req.body,
  );

  response.success(
    res,

    attendance,

    "Checked in successfully",

    201,
  );
});

export const checkOut = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.checkOut(
    req.user._id,

    req.body,
  );

  response.success(
    res,

    attendance,

    "Checked out successfully",
  );
});

export const createAttendance = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.createAttendance(
    req.body,

    req.user._id,
  );

  response.success(
    res,

    attendance,

    "Attendance created successfully",

    201,
  );
});

export const getAttendance = asyncHandler(async (req, res) => {
  const result = await attendanceService.getAttendance(req.query);

  response.paginated(
    res,

    result.data,

    result.pagination,
  );
});

export const getAttendanceById = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.getAttendanceById(req.params.id);

  response.success(
    res,

    attendance,
  );
});

export const getMyAttendance = asyncHandler(async (req, res) => {
  const result = await attendanceService.getMyAttendance(
    req.user._id,

    req.query,
  );

  response.paginated(
    res,

    result.data,

    result.pagination,
  );
});

export const updateAttendance = asyncHandler(async (req, res) => {
  const attendance = await attendanceService.updateAttendance(
    req.params.id,

    req.body,

    req.user._id,
  );

  response.success(
    res,

    attendance,

    "Attendance updated successfully",
  );
});

export const deleteAttendance = asyncHandler(async (req, res) => {
  await attendanceService.deleteAttendance(
    req.params.id,

    req.user._id,
  );

  response.success(
    res,

    null,

    "Attendance deleted successfully",
  );
});
