import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/apiError";
import { loginDataValidation, registerDataValidation } from "../zod/userValidate.zod";
import User from "../models/user.model";
import ApiResponse from "../utils/apiResponse";

export const userRegister = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    const {username, email, password} = req.body

    if([username, email, password].some(ele => ele.trim() == '')) throw new ApiError(400, 'Every field is required')
    if(!registerDataValidation.safeParse(req.body).success) throw new ApiError(400, 'Please provide valid data')
    
    const existingUser = await User.findOne({$or : [{username}, {email}]})
    if(existingUser) throw new ApiError(403, "User already exist with the same emailId or username")

    const createUser = await User.create(req.body)
    
    const user = await User.findById(createUser._id).select('-password')
    if(!user) throw new ApiError(500, 'Something went wrong while creating the user , please try again')

    res.status(200).json(new ApiResponse(200, {message : "User created successfully"}))
})

export const userLogin = asyncHandler(async (req : Request, res : Response, next : NextFunction) => {
    
    const {email, password} = req.body

    if([email, password].some(ele => ele.trim() == '')) throw new ApiError(400, 'Every field is required')
    if(!loginDataValidation.safeParse(req.body).success) throw new ApiError(401, 'Please provide valid data')
    
    const existingUser = await User.findOne({email})
    if(!existingUser) throw new ApiError(401, 'User does not exist with this email id')

    const correctPassword = await existingUser.isPasswordCorrect(password)
    if(!correctPassword) throw new ApiError(402, 'email or password is incorrect')

    const accessToken = existingUser.generateAccessToken()
    const refreshToken = existingUser.generateRefreshToken()

    console.log(accessToken, refreshToken)

    existingUser.refreshToken = refreshToken
    existingUser.save({validateBeforeSave : false})

    const options = {
        httpOnly : true,
        secure : true
    }

    res.status(200).cookie('accessToken' , accessToken, options).cookie('refreshToken', refreshToken, options).json(
        new ApiResponse(200, {message : "User login successfully", accessToken: accessToken, refreshToken: refreshToken})
    )
})

export const updateUserPassword = asyncHandler(async (req : Request, res : Response, next : NextFunction) => {

    try {
        console.log(req.body)
        const {oldPassword, newPassword} = req.body
        if(!oldPassword || !newPassword) throw new ApiError(400, 'Every field is required')
        
        const user = await User.findById(req._id)
        if(!user) throw new ApiError(404, 'user does not exist')
    
        const isPasswordCorrect : boolean = await user.isPasswordCorrect(oldPassword)
        if(!isPasswordCorrect) throw new ApiError(402, 'wrong password entered')
    
        user.password = newPassword
        user.save()
    
        res.status(200).json(new ApiResponse(200, {message : "Password changed successfully"}))
    } catch (error) {
        next(error)
    }
})

export const deleteUser = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {

    const {email, password} = req.body
    const user = await User.findById(req._id)

    if(!user) throw new ApiError(402, "User does not exist")
    if(email !== user.email) throw new ApiError(401, "Wrong credentails")

    const correctPassword = user.isPasswordCorrect(password)
    if(!correctPassword) throw new ApiError(400, "Wrong credentails")

    const deletedUser = await User.findByIdAndDelete(req._id)
    if(!deletedUser) throw new ApiError(500, 'something went wrong while deleting the user')

    res.status(200).cookie('accessToken', '').cookie('refreshToken', '').json({message : "User deleted successfully", deletedUser})
})


