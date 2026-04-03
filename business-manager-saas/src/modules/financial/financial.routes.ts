import { Router } from "express";
import { FinancialController } from "./financial.controller";
import { validate } from "../../middlewares/validate.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
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
  validate(listFinancialEntriesSchema),
  (req, res) => controller.findAll(req, res)
);

financialRoutes.get(
  "/summary",
  (req, res) => controller.getSummary(req, res)
);

financialRoutes.get(
  "/:id",
  validate(getFinancialEntrySchema),
  (req, res) => controller.findById(req, res)
);

financialRoutes.post(
  "/",
  validate(createFinancialEntrySchema),
  (req, res) => controller.create(req, res)
);

financialRoutes.patch(
  "/:id",
  validate(updateFinancialEntrySchema),
  (req, res) => controller.update(req, res)
);

financialRoutes.delete(
  "/:id",
  validate(getFinancialEntrySchema),
  (req, res) => controller.delete(req, res)
);
