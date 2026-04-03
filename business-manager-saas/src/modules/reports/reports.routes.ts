import { Router } from "express";
import { ReportsController } from "./reports.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requirePermission } from "../../middlewares/require-permission.middleware";
import { Permission } from "../../shared/permissions";
import {
  financialReportSchema,
  appointmentsReportSchema,
  comparisonReportSchema,
} from "./reports.schemas";
import { validate } from "../../middlewares/validate.middleware";

export const reportsRoutes = Router();
const controller = new ReportsController();

reportsRoutes.use(authMiddleware);

reportsRoutes.get(
  "/financial",
  requirePermission(Permission.FINANCIAL_READ),
  validate(financialReportSchema),
  (req, res) => controller.getFinancialReport(req, res)
);

reportsRoutes.get(
  "/appointments",
  requirePermission(Permission.APPOINTMENTS_READ),
  validate(appointmentsReportSchema),
  (req, res) => controller.getAppointmentsReport(req, res)
);

reportsRoutes.get(
  "/comparison",
  requirePermission(Permission.FINANCIAL_READ),
  validate(comparisonReportSchema),
  (req, res) => controller.getComparisonReport(req, res)
);
