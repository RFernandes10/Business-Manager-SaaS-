import { Request, Response } from "express";
import { FinancialService } from "./financial.service";
import type {
  CreateFinancialEntryDTO,
  UpdateFinancialEntryDTO,
} from "./financial.schemas";

const financialService = new FinancialService();

export class FinancialController {
  async create(req: Request, res: Response) {
    const entry = await financialService.create(
      req.body as CreateFinancialEntryDTO,
      req.tenantId!
    );
    return res.status(201).json(entry);
  }

  async findAll(req: Request, res: Response) {
    const result = await financialService.findAll(req.tenantId!, req.query as any);
    return res.status(200).json(result);
  }

  async findById(req: Request, res: Response) {
    const entry = await financialService.findById(
      req.params.id as string,
      req.tenantId!
    );
    return res.status(200).json(entry);
  }

  async update(req: Request, res: Response) {
    const entry = await financialService.update(
      req.params.id as string,
      req.body as UpdateFinancialEntryDTO["body"],
      req.tenantId!
    );
    return res.status(200).json(entry);
  }

  async delete(req: Request, res: Response) {
    await financialService.delete(req.params.id as string, req.tenantId!);
    return res.status(204).send();
  }

  async getSummary(req: Request, res: Response) {
    const { startDate, endDate } = req.query as { startDate?: string; endDate?: string };
    const summary = await financialService.getSummary(req.tenantId!, startDate, endDate);
    return res.status(200).json(summary);
  }
}
