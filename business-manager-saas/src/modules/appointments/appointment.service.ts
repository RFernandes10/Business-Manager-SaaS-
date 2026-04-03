import { prisma } from "../../lib/prisma";
import { AppError } from "../../shared/errors/app-error";
import type {
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
  ListAppointmentsDTO,
} from "./appointment.schemas";

export class AppointmentService {
  async create(data: CreateAppointmentDTO, tenantId: string) {
    await this.validateCustomerAndUser(data.customerId, data.userId, tenantId);

    const appointment = await prisma.appointment.create({
      data: {
        tenantId,
        customerId: data.customerId,
        userId: data.userId,
        date: new Date(data.date),
        endDate: new Date(data.endDate),
        service: data.service,
        notes: data.notes || null,
      },
      include: {
        customer: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
      },
    });

    return appointment;
  }

  async findAll(tenantId: string, filters: ListAppointmentsDTO) {
    const { page, limit, customerId, userId, status, startDate, endDate } = filters;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { tenantId };

    if (customerId) where.customerId = customerId;
    if (userId) where.userId = userId;
    if (status) where.status = status;
    if (startDate || endDate) {
      where.date = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      };
    }

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "asc" },
        include: {
          customer: { select: { id: true, name: true, phone: true } },
          user: { select: { id: true, name: true } },
        },
      }),
      prisma.appointment.count({ where }),
    ]);

    return {
      data: appointments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, tenantId: string) {
    const appointment = await prisma.appointment.findFirst({
      where: { id, tenantId },
      include: {
        customer: { select: { id: true, name: true, phone: true, email: true } },
        user: { select: { id: true, name: true } },
      },
    });

    if (!appointment) {
      throw new AppError("Agendamento não encontrado", 404);
    }

    return appointment;
  }

  async update(id: string, data: UpdateAppointmentDTO["body"], tenantId: string) {
    await this.findById(id, tenantId);

    if (data.customerId || data.userId) {
      await this.validateCustomerAndUser(
        data.customerId || "",
        data.userId || "",
        tenantId
      );
    }

    const updateData: Record<string, unknown> = {};

    if (data.customerId !== undefined) updateData.customerId = data.customerId;
    if (data.userId !== undefined) updateData.userId = data.userId;
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.endDate !== undefined) updateData.endDate = new Date(data.endDate);
    if (data.service !== undefined) updateData.service = data.service;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        customer: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
      },
    });

    return appointment;
  }

  async delete(id: string, tenantId: string) {
    await this.findById(id, tenantId);

    await prisma.appointment.delete({
      where: { id },
    });
  }

  private async validateCustomerAndUser(customerId: string, userId: string, tenantId: string) {
    const [customer, user] = await Promise.all([
      prisma.customer.findFirst({ where: { id: customerId, tenantId } }),
      prisma.user.findFirst({ where: { id: userId, tenantId } }),
    ]);

    if (!customer) {
      throw new AppError("Cliente não encontrado", 404);
    }

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }
  }
}
