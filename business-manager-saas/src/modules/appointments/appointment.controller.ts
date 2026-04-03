import { Request, Response } from "express";
import { AppointmentService } from "./appointment.service";
import type { CreateAppointmentDTO, UpdateAppointmentDTO } from "./appointment.schemas";

const appointmentService = new AppointmentService();

export class AppointmentController {
  async create(req: Request, res: Response) {
    const appointment = await appointmentService.create(
      req.body as CreateAppointmentDTO,
      req.tenantId!
    );
    return res.status(201).json(appointment);
  }

  async findAll(req: Request, res: Response) {
    const result = await appointmentService.findAll(req.tenantId!, req.query as any);
    return res.status(200).json(result);
  }

  async findById(req: Request, res: Response) {
    const appointment = await appointmentService.findById(
      req.params.id as string,
      req.tenantId!
    );
    return res.status(200).json(appointment);
  }

  async update(req: Request, res: Response) {
    const appointment = await appointmentService.update(
      req.params.id as string,
      req.body as UpdateAppointmentDTO["body"],
      req.tenantId!
    );
    return res.status(200).json(appointment);
  }

  async delete(req: Request, res: Response) {
    await appointmentService.delete(req.params.id as string, req.tenantId!);
    return res.status(204).send();
  }
}
