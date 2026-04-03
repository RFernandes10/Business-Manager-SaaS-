import { NextFunction, Request, Response } from "express";

export function tenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.tenantId) {
    return res.status(400).json({ error: "Tenant context not found" });
  }

  next();
}
