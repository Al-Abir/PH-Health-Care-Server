import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './confiq';
import initDB from './initTABLE/initDB';
// import userRoutes from './app/module/user/user.router'
// import { searchQuery } from './app/module/Search_Sort_Pagination/Search.route';
// import { AdminRoutes } from './app/module/Admin/Admin.route';
import router from './app/module/Routes';
import ErrorHandling from './app/module/GlobalEorrHanlder/ErrorHandling';
import { StatusCodes } from "http-status-codes";
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
// app.use('/api/v1/user',userRoutes)
// app.use('/api/v1',searchQuery)
// app.use('/api/v1',AdminRoutes)
app.use('/api/v1',router)

//Error Handling middlewre
app.use(ErrorHandling)

app.use((req: Request, res: Response) => {
  // You can log the request object for debugging purposes
  console.log(req);

  // Send a 404 "Not Found" response
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "API NOT FOUND!",
    error:{
      path:req.originalUrl,
      message:"You are request path is not found"
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


