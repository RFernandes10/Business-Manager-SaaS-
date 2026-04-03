import { prisma } from "../../lib/prisma";

export class DashboardService {
  async getDashboard(tenantId: string, startDate?: string, endDate?: string) {
    const dateFilter: Record<string, unknown> = {};
    if (startDate || endDate) {
      dateFilter.date = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      };
    }

    const [
      totalCustomers,
      totalAppointments,
      appointmentsByStatus,
      todayAppointments,
      upcomingAppointments,
      financialSummary,
      recentCustomers,
    ] = await Promise.all([
      prisma.customer.count({ where: { tenantId } }),
      prisma.appointment.count({ where: { tenantId } }),
      prisma.appointment.groupBy({
        by: ["status"],
        where: { tenantId },
        _count: true,
      }),
      prisma.appointment.count({
        where: {
          tenantId,
          date: {
            gte: this.getStartOfDay(),
            lte: this.getEndOfDay(),
          },
        },
      }),
      prisma.appointment.findMany({
        where: {
          tenantId,
          date: { gte: new Date() },
          status: { in: ["SCHEDULED", "CONFIRMED"] },
        },
        take: 5,
        orderBy: { date: "asc" },
        include: {
          customer: { select: { id: true, name: true, phone: true } },
          user: { select: { id: true, name: true } },
        },
      }),
      this.getFinancialSummary(tenantId, startDate, endDate),
      prisma.customer.findMany({
        where: { tenantId },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, phone: true, email: true },
      }),
    ]);

    const statusMap = appointmentsByStatus.reduce(
      (acc: Record<string, number>, item: { status: string; _count: number }) => {
        acc[item.status.toLowerCase()] = item._count;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      overview: {
        totalCustomers,
        totalAppointments,
        todayAppointments,
      },
      appointmentsByStatus: {
        scheduled: statusMap.scheduled || 0,
        confirmed: statusMap.confirmed || 0,
        completed: statusMap.completed || 0,
        cancelled: statusMap.cancelled || 0,
        noShow: statusMap.no_show || 0,
      },
      financial: financialSummary,
      upcomingAppointments,
      recentCustomers,
    };
  }

  private async getFinancialSummary(tenantId: string, startDate?: string, endDate?: string) {
    const dateFilter: Record<string, unknown> = { tenantId };
    if (startDate || endDate) {
      dateFilter.date = {
        ...(startDate && { gte: new Date(startDate) }),
        ...(endDate && { lte: new Date(endDate) }),
      };
    }

    const [incomes, expenses] = await Promise.all([
      prisma.financialEntry.aggregate({
        where: { ...dateFilter, type: "INCOME" },
        _sum: { amount: true },
      }),
      prisma.financialEntry.aggregate({
        where: { ...dateFilter, type: "EXPENSE" },
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

  private getStartOfDay(): Date {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }

  private getEndOfDay(): Date {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    return now;
  }
}
