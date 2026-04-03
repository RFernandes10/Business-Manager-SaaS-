import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authConfig } from "../config/auth";

type TokenPayload = {
  sub: string;
  tenantId: string;
  role: string;
};

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token not provided" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, authConfig.jwtSecret) as TokenPayload;
    req.userId = decoded.sub;
    req.tenantId = decoded.tenantId;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}
