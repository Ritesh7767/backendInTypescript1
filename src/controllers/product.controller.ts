import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import User from "../models/user.model";
import Product from "../models/product.model";
import ApiResponse from "../utils/apiResponse";

export const postProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    
    const {title, color, price} = req.body
    if(title.toString().trim() === '') throw new ApiError(400, "title cannot be empty")
    
    const product = await Product.create({...req.body, owner: req._id})
    if(!product) throw new ApiError(500, "Something went wrong while posting the product")
    
    res.status(200).json({message : "Product created successfully", product})
})

export const getProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const Products = await Product.find({owner : req._id})
    if(!Products) return res.status(200).json(new ApiResponse(200, {message : "No product posted"}))

    res.status(200).json(new ApiResponse(200 , {products : Products}))
})

export const updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const _id = req.query._id
    const {title, price, color} = req.body

    if(!_id) throw new ApiError(401, "Please send product id")
    if([title, price, color].every(ele => ele.trim() == '')) throw new ApiError(200, 'Please enter atleast one field to update')

    const product = await Product.findById(_id)
    if(!product) throw new ApiError(404, "Product does not exist")

    product.title = title
    product.price = price
    product.color = color
    product.save()

    res.status(200).json(new ApiResponse(200, {message : "Product updated successfully", updatedProduct : product}))
})

export const deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const _id = req.query._id
    if(!_id) throw new ApiError(401, 'Please send product id')
    
    const deletedProduct = await Product.findByIdAndDelete(_id)
    if(!deletedProduct) throw new ApiError(404, "Product does not exist")

    res.status(200).json(new ApiResponse(200, {message : "Product deleted successfully", deletedProduct}))
})