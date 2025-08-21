import pool from "../../../confiq";
import { IUser } from "../user/user.interface";
import { userQuery } from "./Search.interface";

export const QueryServiceProvider = async (
  query: userQuery
): Promise<IUser[]> => {
  const {
    searchTerm,
    role,
    status,
    sortBy,
    sortOrder,
    limit = 10,
    page = 1,
  } = query;

  const values: any[] = [];
  const conditions: string[] = [];

  // 1️⃣ Base combined query (make structure same for both tables)
  let sqlQuery = `
    SELECT 
      id,
      name,
      email,
      role,
      status,
      created_at
    FROM (
      -- Users table
      SELECT 
        id, 
        NULL::varchar AS name, 
        email, 
        role::varchar AS role, 
        status::varchar AS status,
        created_at
      FROM users

      UNION ALL

      -- Admin table
      SELECT 
        id, 
        name, 
        email, 
        'ADMIN'::varchar AS role,       -- default role for admin
        'ACTIVE'::varchar AS status,    -- default status
        created_at
      FROM admin
    ) AS combined
  `;

  // 2️⃣ Search term
  if (searchTerm) {
    values.push(`%${searchTerm}%`);
    conditions.push(
      `(name ILIKE $${values.length} OR email ILIKE $${values.length} OR role ILIKE $${values.length} OR status ILIKE $${values.length})`
    );
  }

  // 3️⃣ Role filter
  if (role) {
    values.push(role);
    conditions.push(`role = $${values.length}`);
  }

  // 4️⃣ Status filter
  if (status) {
    values.push(status);
    conditions.push(`status = $${values.length}`);
  }

  // 5️⃣ Apply conditions
  if (conditions.length > 0) {
    sqlQuery += " WHERE " + conditions.join(" AND ");
  }

  // 6️⃣ Sorting
  if (sortBy) {
    sqlQuery += ` ORDER BY ${sortBy} ${
      sortOrder?.toUpperCase() === "DESC" ? "DESC" : "ASC"
    }`;
  } else {
    sqlQuery += " ORDER BY created_at DESC";
  }

  // 7️⃣ Pagination
  const limitNumber = Number(limit);
  const pageNumber = Number(page);
  values.push(limitNumber, (pageNumber - 1) * limitNumber);

  sqlQuery += ` LIMIT $${values.length - 1} OFFSET $${values.length}`;

  // 8️⃣ Execute query
  const result = await pool.query<IUser>(sqlQuery, values);
  return result.rows;
};
