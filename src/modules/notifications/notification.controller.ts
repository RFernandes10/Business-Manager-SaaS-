import { Request, Response } from "express";
import { NotificationService } from "./notification.service";
import type { CreateNotificationDTO, UpdateNotificationDTO } from "./notification.schemas";

const notificationService = new NotificationService();

export class NotificationController {
  async create(req: Request, res: Response) {
    const notification = await notificationService.create(
      req.body as CreateNotificationDTO,
      req.tenantId!
    );
    return res.status(201).json(notification);
  }

  async findAll(req: Request, res: Response) {
    const result = await notificationService.findAll(req.tenantId!, req.query as any);
    return res.status(200).json(result);
  }

  async findById(req: Request, res: Response) {
    const notification = await notificationService.findById(
      req.params.id as string,
      req.tenantId!
    );
    return res.status(200).json(notification);
  }

  async update(req: Request, res: Response) {
    const notification = await notificationService.update(
      req.params.id as string,
      req.body as UpdateNotificationDTO["body"],
      req.tenantId!
    );
    return res.status(200).json(notification);
  }

  async delete(req: Request, res: Response) {
    await notificationService.delete(req.params.id as string, req.tenantId!);
    return res.status(204).send();
  }

  async send(req: Request, res: Response) {
    const notification = await notificationService.send(
      req.params.id as string,
      req.tenantId!
    );
    return res.status(200).json(notification);
  }

  async markAsRead(req: Request, res: Response) {
    const notification = await notificationService.markAsRead(
      req.params.id as string,
      req.tenantId!
    );
    return res.status(200).json(notification);
  }
}
