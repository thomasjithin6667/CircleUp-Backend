import express, { Request, Response } from "express";
const asyncHandler = require('express-async-handler')



export const second=(req: Request, res: Response) => {
    res.send("Adminside");
  }