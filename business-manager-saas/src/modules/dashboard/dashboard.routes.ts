import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

export const dashboardRoutes = Router();
const controller = new DashboardController();

dashboardRoutes.use(authMiddleware);

dashboardRoutes.get("/", (req, res) => controller.getDashboard(req, res));
