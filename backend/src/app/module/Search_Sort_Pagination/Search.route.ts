import express from 'express'
import { searchqueryController } from './Search.controller';



const router = express.Router();


router.get('/searchquery',searchqueryController)




export const searchQuery = router;