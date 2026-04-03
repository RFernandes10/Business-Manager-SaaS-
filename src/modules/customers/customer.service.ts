import { prisma } from "../../lib/prisma";
import { AppError } from "../../shared/errors/app-error";
import type { CreateCustomerDTO, UpdateCustomerDTO, ListCustomersDTO } from "./customer.schemas";

export class CustomerService {
  async create(data: CreateCustomerDTO, tenantId: string) {
    const customer = await prisma.customer.create({
      data: {
        name: data.name,
        phone: data.phone || null,
        email: data.email || null,
        notes: data.notes || null,
        tenantId,
      },
    });

    return customer;
  }

  async findAll(tenantId: string, filters: ListCustomersDTO) {
    const { page, limit, search } = filters;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { tenantId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.customer.count({ where }),
    ]);

    return {
      data: customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, tenantId: string) {
    const customer = await prisma.customer.findFirst({
      where: { id, tenantId },
    });

    if (!customer) {
      throw new AppError("Cliente não encontrado", 404);
    }

    return customer;
  }

  async update(id: string, data: UpdateCustomerDTO["body"], tenantId: string) {
    await this.findById(id, tenantId);

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
    });

    return customer;
  }

  async delete(id: string, tenantId: string) {
    await this.findById(id, tenantId);

    await prisma.customer.delete({
      where: { id },
    });
  }
}
