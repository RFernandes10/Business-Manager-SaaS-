import { prisma } from "../../lib/prisma";
import type {
  FinancialReportDTO,
  AppointmentsReportDTO,
  ComparisonReportDTO,
} from "./reports.schemas";

export class ReportsService {
  async getFinancialReport(tenantId: string, filters: FinancialReportDTO) {
    const { startDate, endDate, period, category } = filters;
    const { dateFrom, dateTo } = this.getDateRange(startDate, endDate, period);

    const where: Record<string, unknown> = {
      tenantId,
      date: { gte: dateFrom, lte: dateTo },
    };
    if (category) where.category = category;

    const entries = await prisma.financialEntry.findMany({
      where,
      orderBy: { date: "asc" },
    });

    const incomes = entries.filter((e) => e.type === "INCOME");
    const expenses = entries.filter((e) => e.type === "EXPENSE");

    const totalIncome = this.sumAmounts(incomes);
    const totalExpense = this.sumAmounts(expenses);

    const byCategory = this.groupByCategory(entries);
    const byDay = this.groupByDay(entries, dateFrom, dateTo);

    return {
      period: { start: dateFrom, end: dateTo },
      summary: {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        profitMargin: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0,
      },
      byCategory,
      byDay,
      chartData: {
        labels: byDay.map((d) => d.label),
        income: byDay.map((d) => d.income),
        expense: byDay.map((d) => d.expense),
      },
    };
  }

  async getAppointmentsReport(tenantId: string, filters: AppointmentsReportDTO) {
    const { startDate, endDate, period, userId } = filters;
    const { dateFrom, dateTo } = this.getDateRange(startDate, endDate, period);

    const where: Record<string, unknown> = {
      tenantId,
      date: { gte: dateFrom, lte: dateTo },
    };
    if (userId) where.userId = userId;

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        customer: { select: { name: true } },
        user: { select: { name: true } },
      },
      orderBy: { date: "asc" },
    });

    const byStatus = this.groupByStatus(appointments);
    const byDay = this.groupAppointmentsByDay(appointments, dateFrom, dateTo);
    const byService = this.groupByService(appointments);
    const byUser = this.groupByUser(appointments);

    return {
      period: { start: dateFrom, end: dateTo },
      summary: {
        total: appointments.length,
        completed: byStatus.completed || 0,
        cancelled: byStatus.cancelled || 0,
        noShow: byStatus.noShow || 0,
        rate: appointments.length > 0 
          ? ((byStatus.completed || 0) / appointments.length) * 100 
          : 0,
      },
      byStatus,
      byService,
      byUser,
      byDay,
      chartData: {
        labels: byDay.map((d) => d.label),
        values: byDay.map((d) => d.count),
      },
    };
  }

  async getComparisonReport(tenantId: string, filters: ComparisonReportDTO) {
    const { currentStart, currentEnd, previousStart, previousEnd } = filters;

    const [current, previous] = await Promise.all([
      this.getPeriodData(tenantId, new Date(currentStart), new Date(currentEnd)),
      this.getPeriodData(tenantId, new Date(previousStart), new Date(previousEnd)),
    ]);

    return {
      current: {
        period: { start: currentStart, end: currentEnd },
        ...current,
      },
      previous: {
        period: { start: previousStart, end: previousEnd },
        ...previous,
      },
      variation: {
        income: this.calculateVariation(current.totalIncome, previous.totalIncome),
        expense: this.calculateVariation(current.totalExpense, previous.totalExpense),
        appointments: this.calculateVariation(current.appointments, previous.appointments),
        customers: this.calculateVariation(current.customers, previous.customers),
      },
    };
  }

  private async getPeriodData(tenantId: string, start: Date, end: Date) {
    const [incomes, expenses, appointments, customers] = await Promise.all([
      prisma.financialEntry.aggregate({
        where: { tenantId, type: "INCOME", date: { gte: start, lte: end } },
        _sum: { amount: true },
      }),
      prisma.financialEntry.aggregate({
        where: { tenantId, type: "EXPENSE", date: { gte: start, lte: end } },
        _sum: { amount: true },
      }),
      prisma.appointment.count({
        where: { tenantId, date: { gte: start, lte: end } },
      }),
      prisma.customer.count({
        where: { tenantId, createdAt: { gte: start, lte: end } },
      }),
    ]);

    return {
      totalIncome: Number(incomes._sum.amount) || 0,
      totalExpense: Number(expenses._sum.amount) || 0,
      balance: (Number(incomes._sum.amount) || 0) - (Number(expenses._sum.amount) || 0),
      appointments,
      customers,
    };
  }

  private getDateRange(startDate?: string, endDate?: string, period?: string) {
    const end = endDate ? new Date(endDate) : new Date();
    const start = startDate 
      ? new Date(startDate) 
      : this.getStartByPeriod(period || "month", end);

    return { dateFrom: start, dateTo: end };
  }

  private getStartByPeriod(period: string, end: Date): Date {
    const start = new Date(end);
    switch (period) {
      case "day":
        start.setDate(start.getDate() - 7);
        break;
      case "week":
        start.setDate(start.getDate() - 30);
        break;
      case "month":
        start.setMonth(start.getMonth() - 1);
        break;
      case "year":
        start.setFullYear(start.getFullYear() - 1);
        break;
    }
    return start;
  }

  private sumAmounts(entries: { amount: unknown }[]): number {
    return entries.reduce((sum, e) => sum + Number(e.amount), 0);
  }

  private groupByCategory(entries: { type: string; category: string | null; amount: unknown }[]) {
    const groups: Record<string, { income: number; expense: number }> = {};

    entries.forEach((e) => {
      const cat = e.category || "Sem categoria";
      if (!groups[cat]) groups[cat] = { income: 0, expense: 0 };
      if (e.type === "INCOME") groups[cat].income += Number(e.amount);
      else groups[cat].expense += Number(e.amount);
    });

    return Object.entries(groups).map(([category, data]) => ({
      category,
      ...data,
      balance: data.income - data.expense,
    }));
  }

  private groupByDay(
    entries: { type: string; date: Date; amount: unknown }[],
    start: Date,
    end: Date
  ) {
    const days: Record<string, { income: number; expense: number }> = {};
    const current = new Date(start);

    while (current <= end) {
      const key = current.toISOString().split("T")[0];
      days[key] = { income: 0, expense: 0 };
      current.setDate(current.getDate() + 1);
    }

    entries.forEach((e) => {
      const key = e.date.toISOString().split("T")[0];
      if (days[key]) {
        if (e.type === "INCOME") days[key].income += Number(e.amount);
        else days[key].expense += Number(e.amount);
      }
    });

    return Object.entries(days).map(([label, data]) => ({ label, ...data }));
  }

  private groupAppointmentsByDay(
    appointments: { date: Date }[],
    start: Date,
    end: Date
  ) {
    const days: Record<string, number> = {};
    const current = new Date(start);

    while (current <= end) {
      const key = current.toISOString().split("T")[0];
      days[key] = 0;
      current.setDate(current.getDate() + 1);
    }

    appointments.forEach((a) => {
      const key = a.date.toISOString().split("T")[0];
      if (days[key] !== undefined) days[key]++;
    });

    return Object.entries(days).map(([label, count]) => ({ label, count }));
  }

  private groupByStatus(appointments: { status: string }[]) {
    const groups: Record<string, number> = {};
    appointments.forEach((a) => {
      groups[a.status] = (groups[a.status] || 0) + 1;
    });
    return groups;
  }

  private groupByService(appointments: { service: string }[]) {
    const groups: Record<string, number> = {};
    appointments.forEach((a) => {
      groups[a.service] = (groups[a.service] || 0) + 1;
    });
    return Object.entries(groups).map(([service, count]) => ({ service, count }));
  }

  private groupByUser(appointments: { user: { name: string } }[]) {
    const groups: Record<string, number> = {};
    appointments.forEach((a) => {
      groups[a.user.name] = (groups[a.user.name] || 0) + 1;
    });
    return Object.entries(groups).map(([user, count]) => ({ user, count }));
  }

  private calculateVariation(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }
}
