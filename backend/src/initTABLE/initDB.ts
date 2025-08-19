import { createAdminTable, createUserTable } from "../app/module/user/user.db";


const initDB = async () => {
    
  await createUserTable();
  await createAdminTable()

  
}

export default initDB