import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import { validate } from "../../middlewares/validate.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requirePermission } from "../../middlewares/require-permission.middleware";
import { Permission } from "../../shared/permissions";
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  getAppointmentSchema,
  listAppointmentsSchema,
} from "./appointment.schemas";

export const appointmentRoutes = Router();
const controller = new AppointmentController();

appointmentRoutes.use(authMiddleware);

appointmentRoutes.get(
  "/",
  requirePermission(Permission.APPOINTMENTS_READ),
  validate(listAppointmentsSchema),
  (req, res) => controller.findAll(req, res)
);

appointmentRoutes.get(
  "/:id",
  requirePermission(Permission.APPOINTMENTS_READ),
  validate(getAppointmentSchema),
  (req, res) => controller.findById(req, res)
);

appointmentRoutes.post(
  "/",
  requirePermission(Permission.APPOINTMENTS_WRITE),
  validate(createAppointmentSchema),
  (req, res) => controller.create(req, res)
);

appointmentRoutes.patch(
  "/:id",
  requirePermission(Permission.APPOINTMENTS_WRITE),
  validate(updateAppointmentSchema),
  (req, res) => controller.update(req, res)
);

appointmentRoutes.delete(
  "/:id",
  requirePermission(Permission.APPOINTMENTS_DELETE),
  validate(getAppointmentSchema),
  (req, res) => controller.delete(req, res)
);
