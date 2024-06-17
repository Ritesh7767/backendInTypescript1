import User from "../models/user.model";
import asyncHandler from "../utils/asyncHandler";
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import ApiError from "../utils/apiError";
import { Request } from "express";

interface JwtPayload {
    _id : mongoose.Schema.Types.ObjectId,
    username : string,
    email : string
}

const isAuth = asyncHandler(async (req , res, next) => {

    try {

        // res.json({message : "auth middleware"})
        let cookieData = jwt.verify(req.cookies.accessToken, `${process.env.ACCESS_SECRET}`) as JwtPayload
        console.log(cookieData)

        let user = await User.findById(cookieData._id)
        if(!user) return new ApiError(404, 'Something went wrong')

        req._id = user._id
        next()

    } catch (error) {
        throw new ApiError(400, 'You are not authorised for this action')
    }
})

export default isAuth