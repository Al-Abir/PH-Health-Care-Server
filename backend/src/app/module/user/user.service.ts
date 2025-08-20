import pool from "../../../confiq/index";
import bcrypt from "bcrypt";
import { INewUser, INewAdmin, IUser, IAdmin, UserRole, UserStatus } from "./user.interface";

// Input type for createAdmin
export interface ICreateAdminInput {
  user: INewUser & { password: string };  // user table insert, password অবশ্যই থাকবে
  admin: INewAdmin;                       // admin table insert, password নেই
}

// Return type
export interface ICreateAdminOutput {
  user: IUser;
  admin: IAdmin;
}

const createAdmin = async (
  data: ICreateAdminInput
): Promise<ICreateAdminOutput> => {
  const client = await pool.connect();
  const hashPassword = await bcrypt.hash(data.user.password, 12);

  try {
    await client.query("BEGIN");

    // Insert into users table
    const userResult = await client.query<IUser>(
      `INSERT INTO users (email, password, role, needPasswordChange, status) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [
        data.user.email,
        hashPassword,
       data.user.role || UserRole.ADMIN,            // default ADMIN
      data.user.needPasswordChange ?? false,      // default false
      data.user.status || UserStatus.ACTIVE       // default ACTIVE
      ]
    );
    const user = userResult.rows[0];

    // Insert into admin table
    const adminResult = await client.query<IAdmin>(
      `INSERT INTO admin (name, email, portfolio_image, contact_number, isDeleted) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [
        data.admin.name || null,
        user.email,
        data.admin.portfolio_image || null,
        data.admin.contact_number || null,
        data.admin.isDeleted
      ]
    );
    const admin = adminResult.rows[0];

    await client.query("COMMIT");
    return { user, admin };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating admin:", error);
    throw error;
  } finally {
    client.release();
  }
};


export const userService = {
  createAdmin,
};
