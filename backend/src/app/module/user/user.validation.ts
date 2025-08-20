import { z } from "zod";
import { UserRole, UserStatus } from "./user.interface";

export const NewUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  role: z.nativeEnum(UserRole).optional(), // optional, DB default ADMIN/PATIENT
  needPasswordChange: z.boolean().optional(), // optional, DB default false
  status: z.nativeEnum(UserStatus).optional(), // optional, DB default ACTIVE
});

// ---------------- Zod schema for INewAdmin ----------------
export const NewAdminSchema = z.object({
  name: z.string().nullable(),
  email: z.string().email({ message: "Invalid email address" }),
  portfolio_image: z.string().url().nullable().optional(),
  contact_number: z.string().nullable().optional(),
  isDeleted: z.boolean(),
});

// ---------------- Combined schema for creating admin ----------------
export const CreateAdminSchema = z.object({
  user: NewUserSchema,
  admin: NewAdminSchema,
});
