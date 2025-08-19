
// ---------------- ENUMS ----------------
export enum UserRole {
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  PATIENT = "PATIENT",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

// ---------------- USER INTERFACE ----------------
export interface IUser {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  needPasswordChange: boolean;
  status: UserStatus;
  created_at: Date;
  updated_at: Date;
}

// Insert type (for creating new user)
export type INewUser = Omit<IUser, "id" | "created_at" | "updated_at">;

// ---------------- ADMIN INTERFACE ----------------
export interface IAdmin {
  id: number;
  name: string | null; // nullable allowed
  email: string;
  portfolio_image?: string | null; // optional field
  contact_number?: string | null;  // optional field
  isDeleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IAdmin {
  id: number;
  name: string | null;
  email: string;
  portfolio_image?: string | null;
  contact_number?: string | null;
  isDeleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export type INewAdmin = Omit<IAdmin, "id" | "created_at" | "updated_at">;
