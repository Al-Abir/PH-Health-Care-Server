
import pool from "../../../confiq";
import { Admin } from "./Admin.interface";

const getAlldata = async ():Promise<Admin[]> => {
  const query = `SELECT * FROM admin WHERE isdeleted = false`;
  const result = await pool.query(query); 
  return result.rows;  
};


const singleUser = async (id:string): Promise<Admin|null> =>{
    const values =Number(id)

    const query = `SELECT * FROM admin WHERE id = $1 AND NOT isdeleted`;
     const result = await pool.query(query,[values])

     if(result.rows.length>0){

         return result.rows[0];
     }
     return null;
}


export const updateDataDB = async (
  id: number,
  data: Partial<Admin>
): Promise<Admin> => {
  // 1️⃣ Check if admin exists and is not soft-deleted
  const check = await pool.query(
    `SELECT * FROM admin WHERE id = $1 AND isdeleted = false`,
    [id]
  );

if (check.rows.length === 0) {
  const error = new Error("Admin not found or has been deleted") as any;
  error.status = 404;  // ✅ attach status
  throw error;
}
  const fields = Object.keys(data);
  const values = Object.values(data);

  if (fields.length === 0) {
    const error = new Error("No fields to update") as any;
    error.status = 400;
    throw error;
  }

  // 2️⃣ Build dynamic SET clause
  const setClause = fields.map((f, i) => `"${f}" = $${i + 1}`).join(", ");

  // 3️⃣ Add id as last parameter
  const query = `UPDATE admin SET ${setClause}, updated_at = NOW() WHERE id = $${
    fields.length + 1
  } RETURNING *`;

  const result = await pool.query(query, [...values, id]);

  return result.rows[0] as Admin;
};
export const hardDeleteAdminUser = async (id: number) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Delete from admin and get deleted row
    const { rows } = await client.query(
      `DELETE FROM admin WHERE id = $1 RETURNING *`,
      [id]
    );

    if (rows.length === 0) {
      throw new Error(`Admin with id ${id} not found`);
    }

    const adminEmail = rows[0].email;

    // Delete corresponding user by email
    await client.query(`DELETE FROM users WHERE email = $1`, [adminEmail]);

    await client.query("COMMIT");

    console.log(`✅ Deleted user and admin with email ${adminEmail}`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Transaction failed:", error);
    throw error;
  } finally {
    client.release();
  }
};

export const softDeleteUserAdmin = async (id: number) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1️⃣ Get admin data
    const { rows } = await client.query(`SELECT * FROM admin WHERE id = $1`, [id]);

    if (rows.length === 0) {
      throw new Error(`Admin with id ${id} not found`);
    }

    const adminEmail = rows[0].email;

    // 2️⃣ Update admin isDeleted = true
    await client.query(`UPDATE admin SET isDeleted = true, updated_at = NOW() WHERE id = $1`, [id]);

    // 3️⃣ Update corresponding user status = 'BLOCKED'
    await client.query(`UPDATE users SET status = 'BLOCKED', updated_at = NOW() WHERE email = $1`, [adminEmail]);

    await client.query("COMMIT");

    console.log(`✅ Soft deleted admin and blocked user with email ${adminEmail}`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Transaction failed:", error);
    throw error;
  } finally {
    client.release();
  }
};
export const AdminService = {
  getAlldata,
  singleUser,
  updateDataDB,
  hardDeleteAdminUser,
  softDeleteUserAdmin
};
