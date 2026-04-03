import { Request, Response } from "express";
import { CustomerService } from "./customer.service";
import type { CreateCustomerDTO, UpdateCustomerDTO } from "./customer.schemas";

const customerService = new CustomerService();

export class CustomerController {
  async create(req: Request, res: Response) {
    const customer = await customerService.create(
      req.body as CreateCustomerDTO,
      req.tenantId!
    );
    return res.status(201).json(customer);
  }

  async findAll(req: Request, res: Response) {
    const result = await customerService.findAll(req.tenantId!, req.query as any);
    return res.status(200).json(result);
  }

  async findById(req: Request, res: Response) {
    const customer = await customerService.findById(
      req.params.id as string,
      req.tenantId!
    );
    return res.status(200).json(customer);
  }

  async update(req: Request, res: Response) {
    const customer = await customerService.update(
      req.params.id as string,
      req.body as UpdateCustomerDTO["body"],
      req.tenantId!
    );
    return res.status(200).json(customer);
  }

  async delete(req: Request, res: Response) {
    await customerService.delete(req.params.id as string, req.tenantId!);
    return res.status(204).send();
  }
}
