import { Request, Response } from "express";
import { ReportsService } from "./reports.service";
import type { FinancialReportDTO, AppointmentsReportDTO, ComparisonReportDTO } from "./reports.schemas";

const reportsService = new ReportsService();

export class ReportsController {
  async getFinancialReport(req: Request, res: Response) {
    const report = await reportsService.getFinancialReport(req.tenantId!, req.query as FinancialReportDTO);
    return res.status(200).json(report);
  }

  async getAppointmentsReport(req: Request, res: Response) {
    const report = await reportsService.getAppointmentsReport(req.tenantId!, req.query as AppointmentsReportDTO);
    return res.status(200).json(report);
  }

  async getComparisonReport(req: Request, res: Response) {
    const report = await reportsService.getComparisonReport(req.tenantId!, req.query as unknown as ComparisonReportDTO);
    return res.status(200).json(report);
  }
}
