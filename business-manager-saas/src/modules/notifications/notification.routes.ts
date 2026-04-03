import { Router } from "express";
import { NotificationController } from "./notification.controller";
import { validate } from "../../middlewares/validate.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requirePermission } from "../../middlewares/require-permission.middleware";
import { Permission } from "../../shared/permissions";
import {
  createNotificationSchema,
  updateNotificationSchema,
  getNotificationSchema,
  listNotificationsSchema,
} from "./notification.schemas";

export const notificationRoutes = Router();
const controller = new NotificationController();

notificationRoutes.use(authMiddleware);

notificationRoutes.get(
  "/",
  requirePermission(Permission.NOTIFICATIONS_READ),
  validate(listNotificationsSchema),
  (req, res) => controller.findAll(req, res)
);

notificationRoutes.get(
  "/:id",
  requirePermission(Permission.NOTIFICATIONS_READ),
  validate(getNotificationSchema),
  (req, res) => controller.findById(req, res)
);

notificationRoutes.post(
  "/",
  requirePermission(Permission.NOTIFICATIONS_WRITE),
  validate(createNotificationSchema),
  (req, res) => controller.create(req, res)
);

notificationRoutes.patch(
  "/:id",
  requirePermission(Permission.NOTIFICATIONS_WRITE),
  validate(updateNotificationSchema),
  (req, res) => controller.update(req, res)
);

notificationRoutes.delete(
  "/:id",
  requirePermission(Permission.NOTIFICATIONS_DELETE),
  validate(getNotificationSchema),
  (req, res) => controller.delete(req, res)
);

notificationRoutes.post(
  "/:id/send",
  requirePermission(Permission.NOTIFICATIONS_WRITE),
  validate(getNotificationSchema),
  (req, res) => controller.send(req, res)
);

notificationRoutes.post(
  "/:id/read",
  requirePermission(Permission.NOTIFICATIONS_READ),
  validate(getNotificationSchema),
  (req, res) => controller.markAsRead(req, res)
);
