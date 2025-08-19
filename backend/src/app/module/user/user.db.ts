import pool from "../../../confiq/index";

// ---------------- Create Users Table ----------------
export const createUserTable = async () => {
  try {
    // ✅ Step 1: Create ENUM safely (only if not exists)
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userrole') THEN
          CREATE TYPE "userRole" AS ENUM ('ADMIN', 'DOCTOR', 'PATIENT', 'SUPER_ADMIN');
        END IF;
      END$$;
    `);

    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'userstatus') THEN
          CREATE TYPE "userStatus" AS ENUM ('ACTIVE', 'BLOCKED');
        END IF;
      END$$;
    `);

    // ✅ Step 2: Create Users Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role "userRole" NOT NULL DEFAULT 'PATIENT',
        needPasswordChange BOOLEAN DEFAULT false,
        status "userStatus" NOT NULL DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log("✅ Users table created successfully");
  } catch (error) {
    console.error("❌ Error creating users table:", error);
  }
};

export const createAdminTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(150) UNIQUE,
      portfolio_image VARCHAR(255),
      contact_number VARCHAR(50),
      isDeleted BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      FOREIGN KEY (email) REFERENCES users(email)
    )
  `);
  console.log("✅ Admin table created");
};
