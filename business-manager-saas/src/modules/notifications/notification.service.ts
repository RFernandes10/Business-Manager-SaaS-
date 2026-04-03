import { prisma } from "../../lib/prisma";
import { AppError } from "../../shared/errors/app-error";
import type { CreateNotificationDTO, UpdateNotificationDTO, ListNotificationsDTO } from "./notification.schemas";

export class NotificationService {
  async create(data: CreateNotificationDTO, tenantId: string) {
    const notification = await prisma.notification.create({
      data: {
        tenantId,
        customerId: data.customerId || null,
        type: data.type,
        channel: data.channel,
        recipient: data.recipient,
        subject: data.subject || null,
        content: data.content,
        scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
      },
    });

    return notification;
  }

  async findAll(tenantId: string, filters: ListNotificationsDTO) {
    const { page, limit, status, type } = filters;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { tenantId };

    if (status) {
      where.status = status;
    }

    if (type) {
      where.type = type;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
        },
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      data: notifications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, tenantId: string) {
    const notification = await prisma.notification.findFirst({
      where: { id, tenantId },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
          },
        },
      },
    });

    if (!notification) {
      throw new AppError("Notificação não encontrada", 404);
    }

    return notification;
  }

  async update(id: string, data: UpdateNotificationDTO["body"], tenantId: string) {
    await this.findById(id, tenantId);

    const updateData: Record<string, unknown> = {};

    if (data.status) {
      updateData.status = data.status;
      if (data.status === "SENT") {
        updateData.sentAt = new Date();
      }
    }

    if (data.content) {
      updateData.content = data.content;
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: updateData,
    });

    return notification;
  }

  async delete(id: string, tenantId: string) {
    await this.findById(id, tenantId);

    await prisma.notification.delete({
      where: { id },
    });
  }

  async markAsRead(id: string, tenantId: string) {
    return this.update(id, { status: "READ" }, tenantId);
  }

  async send(id: string, tenantId: string) {
    const notification = await this.findById(id, tenantId);

    try {
      await this.sendNotification(notification);

      return await prisma.notification.update({
        where: { id },
        data: {
          status: "SENT",
          sentAt: new Date(),
        },
      });
    } catch (error) {
      return await prisma.notification.update({
        where: { id },
        data: {
          status: "FAILED",
          error: error instanceof Error ? error.message : "Erro desconhecido",
        },
      });
    }
  }

  private async sendNotification(notification: { channel: string; recipient: string; subject: string | null; content: string }) {
    console.log(`[Notification] Sending via ${notification.channel} to ${notification.recipient}`);
    console.log(`[Notification] Subject: ${notification.subject}`);
    console.log(`[Notification] Content: ${notification.content}`);
    
    return true;
  }
}
