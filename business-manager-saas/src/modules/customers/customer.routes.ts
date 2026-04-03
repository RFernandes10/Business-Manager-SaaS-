import { Router } from "express";
import { CustomerController } from "./customer.controller";
import { validate } from "../../middlewares/validate.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
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
  validate(listCustomersSchema),
  (req, res) => controller.findAll(req, res)
);

customerRoutes.get(
  "/:id",
  validate(getCustomerSchema),
  (req, res) => controller.findById(req, res)
);

customerRoutes.post(
  "/",
  validate(createCustomerSchema),
  (req, res) => controller.create(req, res)
);

customerRoutes.patch(
  "/:id",
  validate(updateCustomerSchema),
  (req, res) => controller.update(req, res)
);

customerRoutes.delete(
  "/:id",
  validate(getCustomerSchema),
  (req, res) => controller.delete(req, res)
);
