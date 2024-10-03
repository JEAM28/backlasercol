import { SetMetadata } from "@nestjs/common";
import { Role } from "src/roles.enum";

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles)