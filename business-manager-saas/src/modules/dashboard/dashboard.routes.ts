import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requirePermission } from "../../middlewares/require-permission.middleware";
import { Permission } from "../../shared/permissions";

export const dashboardRoutes = Router();
const controller = new DashboardController();

dashboardRoutes.use(authMiddleware);

dashboardRoutes.get(
  "/",
  requirePermission(Permission.DASHBOARD_READ),
  (req, res) => controller.getDashboard(req, res)
);
