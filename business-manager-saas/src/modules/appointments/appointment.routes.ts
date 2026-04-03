import { Router } from "express";
import { AppointmentController } from "./appointment.controller";
import { validate } from "../../middlewares/validate.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
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
  validate(listAppointmentsSchema),
  (req, res) => controller.findAll(req, res)
);

appointmentRoutes.get(
  "/:id",
  validate(getAppointmentSchema),
  (req, res) => controller.findById(req, res)
);

appointmentRoutes.post(
  "/",
  validate(createAppointmentSchema),
  (req, res) => controller.create(req, res)
);

appointmentRoutes.patch(
  "/:id",
  validate(updateAppointmentSchema),
  (req, res) => controller.update(req, res)
);

appointmentRoutes.delete(
  "/:id",
  validate(getAppointmentSchema),
  (req, res) => controller.delete(req, res)
);
