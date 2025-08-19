import pool from "../../../confiq/index";
import { UserRole } from "./user.interface";
import bcrypt from "bcrypt";
const createAdmin = async (data: any) => {
  const client = await pool.connect();
  const hashPassword: string = await bcrypt.hash(data.password,12);
  try {
    await client.query("BEGIN"); // ✅ Transaction শুরু

    // 1️⃣ Insert into users table
    const userResult = await client.query(
      `
      INSERT INTO users (email, password, role)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [data.admin.email, hashPassword, UserRole.ADMIN]
    );

    const user = userResult.rows[0];

    // 2️⃣ Insert into admin table
    const adminResult = await client.query(
      `
      INSERT INTO admin (name, email, portfolio_image, contact_number)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [
        data.admin.name || null,
        user.email,
        data.admin.portfolio_image || null,
        data.admin.contact_number || null,
      ]
    );

    const admin = adminResult.rows[0];

    await client.query("COMMIT"); // ✅ সব ঠিক থাকলে commit

    return { user, admin };
  } catch (error) {
    await client.query("ROLLBACK"); // ❌ Error এ rollback
    console.error("❌ Error creating admin:", error);
    throw error;
  } finally {
    client.release();
  }
};

export const userService = {
  createAdmin,
};
