import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { authConfig } from "../../config/auth";
import { AppError } from "../../shared/errors/app-error";

type RegisterDTO = {
  tenantName: string;
  tenantSlug: string;
  name: string;
  email: string;
  password: string;
};

type LoginDTO = {
  email: string;
  password: string;
  tenantSlug: string;
};

export class AuthService {
  async register(data: RegisterDTO) {
    const tenantExists = await prisma.tenant.findUnique({
      where: { slug: data.tenantSlug },
    });

    if (tenantExists) {
      throw new AppError("Tenant slug already exists", 409);
    }

    const passwordHash = await bcrypt.hash(data.password, 10);

    const tenant = await prisma.tenant.create({
      data: {
        name: data.tenantName,
        slug: data.tenantSlug,
        users: {
          create: {
            name: data.name,
            email: data.email,
            passwordHash,
            role: "ADMIN",
          },
        },
      },
      include: {
        users: true,
      },
    });

    const user = tenant.users[0];

    const token = jwt.sign(
      { sub: user.id, tenantId: tenant.id, role: user.role },
      authConfig.jwtSecret,
      { expiresIn: authConfig.expiresIn }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
      },
      token,
    };
  }

  async login(data: LoginDTO) {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: data.tenantSlug },
    });

    if (!tenant) {
      throw new AppError("Tenant not found", 404);
    }

    const user = await prisma.user.findFirst({
      where: {
        tenantId: tenant.id,
        email: data.email,
      },
    });

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const passwordMatches = await bcrypt.compare(data.password, user.passwordHash);

    if (!passwordMatches) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign(
      { sub: user.id, tenantId: tenant.id, role: user.role },
      authConfig.jwtSecret,
      { expiresIn: authConfig.expiresIn }
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
      },
      token,
    };
  }
}
