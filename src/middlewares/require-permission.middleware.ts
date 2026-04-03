import { Request, Response, NextFunction } from "express";
import { Permission, RolePermissions } from "../shared/permissions";

export function requirePermission(...permissions: Permission[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.userRole;

    if (!userRole) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const rolePermissions = RolePermissions[userRole];

    if (!rolePermissions) {
      return res.status(403).json({ error: "Role not found" });
    }

    const hasPermission = permissions.every((permission) =>
      rolePermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({ error: "Forbidden: insufficient permissions" });
    }

    next();
  };
}
