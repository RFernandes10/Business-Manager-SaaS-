import { env } from "./env";
import type { SignOptions } from "jsonwebtoken";

export const authConfig = {
  jwtSecret: env.JWT_SECRET,
  expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
};
