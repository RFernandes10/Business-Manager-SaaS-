import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../shared/errors/app-error";
import type {
  CreateFinancialEntryDTO,
  UpdateFinancialEntryDTO,
  ListFinancialEntriesDTO,
} from "./financial.schemas";

export class FinancialService {
  async create(data: CreateFinancialEntryDTO, tenantId: string) {
    const entry = await prisma.financialEntry.create({
      data: {
        tenantId,
        type: data.type,
        amount: new Prisma.Decimal(data.amount),
        description: data.description,
        category: data.category || null,
        date: new Date(data.date),
      },
    });

    return entry;
  }

  async findAll(tenantId: string, filters: ListFinancialEntriesDTO) {
    const { page, limit, type, category, startDate, endDate } = filters;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { tenantId };

    if (type) where.type = type;
    if (category) where.category = category;
    if (startDate || endDate) {
      where.date = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      };
    }

    const [entries, total] = await Promise.all([
      prisma.financialEntry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: "desc" },
      }),
      prisma.financialEntry.count({ where }),
    ]);

    return {
      data: entries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string, tenantId: string) {
    const entry = await prisma.financialEntry.findFirst({
      where: { id, tenantId },
    });

    if (!entry) {
      throw new AppError("Lançamento não encontrado", 404);
    }

    return entry;
  }

  async update(id: string, data: UpdateFinancialEntryDTO["body"], tenantId: string) {
    await this.findById(id, tenantId);

    const updateData: Record<string, unknown> = {};

    if (data.type !== undefined) updateData.type = data.type;
    if (data.amount !== undefined) updateData.amount = new Prisma.Decimal(data.amount);
    if (data.description !== undefined) updateData.description = data.description;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.date !== undefined) updateData.date = new Date(data.date);

    const entry = await prisma.financialEntry.update({
      where: { id },
      data: updateData,
    });

    return entry;
  }

  async delete(id: string, tenantId: string) {
    await this.findById(id, tenantId);

    await prisma.financialEntry.delete({
      where: { id },
    });
  }

  async getSummary(tenantId: string, startDate?: string, endDate?: string) {
    const where: Record<string, unknown> = { tenantId };

    if (startDate || endDate) {
      where.date = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      };
    }

    const [incomes, expenses] = await Promise.all([
      prisma.financialEntry.aggregate({
        where: { ...where, type: "INCOME" },
        _sum: { amount: true },
      }),
      prisma.financialEntry.aggregate({
        where: { ...where, type: "EXPENSE" },
        _sum: { amount: true },
      }),
    ]);

    const totalIncome = Number(incomes._sum.amount) || 0;
    const totalExpense = Number(expenses._sum.amount) || 0;

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    };
  }
}
