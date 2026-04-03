import { Router } from "express";
import { CustomerController } from "./customer.controller";
import { validate } from "../../middlewares/validate.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requirePermission } from "../../middlewares/require-permission.middleware";
import { Permission } from "../../shared/permissions";
import {
  createCustomerSchema,
  updateCustomerSchema,
  getCustomerSchema,
  listCustomersSchema,
} from "./customer.schemas";

export const customerRoutes = Router();
const controller = new CustomerController();

customerRoutes.use(authMiddleware);

customerRoutes.get(
  "/",
  requirePermission(Permission.CUSTOMERS_READ),
  validate(listCustomersSchema),
  (req, res) => controller.findAll(req, res)
);

customerRoutes.get(
  "/:id",
  requirePermission(Permission.CUSTOMERS_READ),
  validate(getCustomerSchema),
  (req, res) => controller.findById(req, res)
);

customerRoutes.post(
  "/",
  requirePermission(Permission.CUSTOMERS_WRITE),
  validate(createCustomerSchema),
  (req, res) => controller.create(req, res)
);

customerRoutes.patch(
  "/:id",
  requirePermission(Permission.CUSTOMERS_WRITE),
  validate(updateCustomerSchema),
  (req, res) => controller.update(req, res)
);

customerRoutes.delete(
  "/:id",
  requirePermission(Permission.CUSTOMERS_DELETE),
  validate(getCustomerSchema),
  (req, res) => controller.delete(req, res)
);
