import express, { Request, Response } from "express";
const asyncHandler = require('express-async-handler')

export const first =(req: Request, res: Response) => {
    res.send("userside");
  }

