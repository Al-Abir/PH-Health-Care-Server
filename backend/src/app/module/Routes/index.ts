import express from 'express'
import userRoutes from '../user/user.router'
import { searchQuery } from '../Search_Sort_Pagination/Search.route';
import { AdminRoutes } from '../Admin/Admin.route';
import path from 'path';
import { AuthRoutes } from '../Auth/AuthRoute';
const router = express.Router();

const moduleRoutes = [
    {
         path:'/user',
         route:userRoutes
    },
    {
        path:'/',
        route: searchQuery
    },
    {
        path:'/',
        route: AdminRoutes
    },
    {
        path:'/auth',
        route:AuthRoutes
    }
]

moduleRoutes.forEach((route)=> router.use(route.path, route.route))



export default router;

