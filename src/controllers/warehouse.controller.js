import asyncHandler from "../utils/asyncHandler.js";

import warehouseService from "../services/warehouse.service.js";

import * as response from "../utils/apiResponse.js";

export const createWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await warehouseService.createWarehouse(
    req.body,

    req.user._id,
  );

  response.success(
    res,

    warehouse,

    "Warehouse created successfully",

    201,
  );
});

export const getWarehouses = asyncHandler(async (req, res) => {
  const result = await warehouseService.getWarehouses(req.query);

  response.paginated(
    res,

    result.data,

    result.pagination,
  );
});

export const getWarehouseById = asyncHandler(async (req, res) => {
  const warehouse = await warehouseService.getWarehouseById(req.params.id);

  response.success(res, warehouse);
});

export const updateWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await warehouseService.updateWarehouse(
    req.params.id,

    req.body,

    req.user._id,
  );

  response.success(
    res,

    warehouse,

    "Warehouse updated successfully",
  );
});

export const deleteWarehouse = asyncHandler(async (req, res) => {
  await warehouseService.deleteWarehouse(
    req.params.id,

    req.user._id,
  );

  response.success(
    res,

    null,

    "Warehouse deleted successfully",
  );
});

export const restoreWarehouse = asyncHandler(async (req, res) => {
  const warehouse = await warehouseService.restoreWarehouse(
    req.params.id,

    req.user._id,
  );

  response.success(
    res,

    warehouse,

    "Warehouse restored successfully",
  );
});
