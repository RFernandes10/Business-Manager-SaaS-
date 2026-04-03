import { Router } from "express";
import { FinancialController } from "./financial.controller";
import { validate } from "../../middlewares/validate.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requirePermission } from "../../middlewares/require-permission.middleware";
import { Permission } from "../../shared/permissions";
import {
  createFinancialEntrySchema,
  updateFinancialEntrySchema,
  getFinancialEntrySchema,
  listFinancialEntriesSchema,
} from "./financial.schemas";

export const financialRoutes = Router();
const controller = new FinancialController();

financialRoutes.use(authMiddleware);

financialRoutes.get(
  "/",
  requirePermission(Permission.FINANCIAL_READ),
  validate(listFinancialEntriesSchema),
  (req, res) => controller.findAll(req, res)
);

financialRoutes.get(
  "/summary",
  requirePermission(Permission.FINANCIAL_READ),
  (req, res) => controller.getSummary(req, res)
);

financialRoutes.get(
  "/:id",
  requirePermission(Permission.FINANCIAL_READ),
  validate(getFinancialEntrySchema),
  (req, res) => controller.findById(req, res)
);

financialRoutes.post(
  "/",
  requirePermission(Permission.FINANCIAL_WRITE),
  validate(createFinancialEntrySchema),
  (req, res) => controller.create(req, res)
);

financialRoutes.patch(
  "/:id",
  requirePermission(Permission.FINANCIAL_WRITE),
  validate(updateFinancialEntrySchema),
  (req, res) => controller.update(req, res)
);

financialRoutes.delete(
  "/:id",
  requirePermission(Permission.FINANCIAL_DELETE),
  validate(getFinancialEntrySchema),
  (req, res) => controller.delete(req, res)
);
