import { NextFunction, Request, Response } from "express";

const asyncHandler = (func : (req: Request, res: Response, next : NextFunction) => {}) => async (req: Request, res : Response, next : NextFunction) => {
    try{
        await func(req, res, next)
    }
    catch(err){
        next(err)
    }
}

export default asyncHandler