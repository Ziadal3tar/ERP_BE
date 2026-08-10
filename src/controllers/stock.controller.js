import asyncHandler from "../utils/asyncHandler.js";

import stockService from "../services/stock.service.js";

import * as response from "../utils/apiResponse.js";

export const stockIn = asyncHandler(async (req, res) => {
  const result = await stockService.stockIn(
    req.body,

    req.user._id,
  );

  response.success(
    res,

    result,

    "Stock added successfully",

    201,
  );
});

export const stockOut = asyncHandler(async (req, res) => {
  const result = await stockService.stockOut(
    req.body,

    req.user._id,
  );

  response.success(
    res,

    result,

    "Stock removed successfully",
  );
});

export const transferStock = asyncHandler(async (req, res) => {
  const result = await stockService.transferStock(
    req.body,

    req.user._id,
  );

  response.success(
    res,

    result,

    "Stock transferred successfully",
  );
});

export const getStock = asyncHandler(async (req, res) => {
  const result = await stockService.getStock(req.query);

  response.paginated(
    res,

    result.data,

    result.pagination,
  );
});

export const getStockHistory = asyncHandler(async (req, res) => {
  const result = await stockService.getStockHistory(req.query);

  response.paginated(
    res,

    result.data,

    result.pagination,
  );
});
