import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

const dashboardService = new DashboardService();

export class DashboardController {
  async getDashboard(req: Request, res: Response) {
    const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };
    const data = await dashboardService.getDashboard(req.tenantId!, startDate, endDate);
    return res.status(200).json(data);
  }
}
