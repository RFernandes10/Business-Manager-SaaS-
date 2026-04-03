import { Router } from "express";
import { healthRoutes } from "../modules/health/health.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { customerRoutes } from "../modules/customers/customer.routes";
import { appointmentRoutes } from "../modules/appointments/appointment.routes";
import { financialRoutes } from "../modules/financial/financial.routes";
import { dashboardRoutes } from "../modules/dashboard/dashboard.routes";
import { reportsRoutes } from "../modules/reports/reports.routes";

export const routes = Router();

routes.use("/health", healthRoutes);
routes.use("/auth", authRoutes);
routes.use("/customers", customerRoutes);
routes.use("/appointments", appointmentRoutes);
routes.use("/financial", financialRoutes);
routes.use("/dashboard", dashboardRoutes);
routes.use("/reports", reportsRoutes);
