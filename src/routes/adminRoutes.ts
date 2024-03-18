import express, { Request, Response } from "express";
import {second} from '../controllers/adminController'

const router =express.Router()

router.get("/", second);


export default router