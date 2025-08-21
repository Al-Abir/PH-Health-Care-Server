import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './confiq';
import initDB from './initTABLE/initDB';
import userRoutes from './app/module/user/user.router'
import { searchQuery } from './app/module/Search_Sort_Pagination/Search.route';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;



// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} hit`)
  next()
})
// Middleware
app.use(cors());
app.use(express.json());



// Initialize DB tables (safe way)
initDB()


// sever connetion check
app.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT current_database()')
    console.log(result.rows) // Debug: DB query result
    res.send(`The database name is: ${result.rows[0].current_database}`)
  } catch (err) {
    console.error('DB Query Error:', err)
    res.status(500).send('Database query failed')
  }
})

//routes
app.use('/api/v1/user',userRoutes)
app.use('/api/v1',searchQuery)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


