import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "./auth.schemas";

export const authRoutes = Router();
const controller = new AuthController();

authRoutes.post("/register", validate(registerSchema), (req, res) =>
  controller.register(req, res)
);

authRoutes.post("/login", validate(loginSchema), (req, res) =>
  controller.login(req, res)
);
