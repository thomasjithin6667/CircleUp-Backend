import express, { Express, Request, Response } from "express";
import {first} from '../controllers/userController'

const router =express.Router()

router.get("/", first);

export default router