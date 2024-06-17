import mongoose, {Document} from "mongoose";
import { NextFunction } from "express";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

interface IUser extends Document {
    _id : string
    username : string,
    email : string,
    password : string,
    refreshToken? : string,
    isPasswordCorrect : (password : string) => Promise<boolean>,
    generateAccessToken : () => string,
    generateRefreshToken : () => string
}
const userSchema = new mongoose.Schema<IUser>(
    {
        username : {
            type : String,
            required : true,
            unique : true,
            trim : true,
            lowercase : true
        },
        email : {
            type : String,
            unique : true,
            required : true,
            trim : true,
            lowercase : true
        },
        password : {
            type : String,
            trim : true
        },
        refreshToken : {
            type : String
        }
    },
    {
        timestamps : true,
        versionKey : false
    }
)

userSchema.pre("save", async function (next){
    
    if(!this.isModified("password")) return next()
        
    this.password = await bcrypt.hash(this.password, 5)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password : string){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id,
            username : this.username,
            email : this.email
        },
        `${process.env.ACCESS_SECRET}`,
        {
            expiresIn : process.env.ACCESS_EXPIRY
        }        
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id
        },
        `${process.env.REFRESH_SECRET}`,
        {
            expiresIn : process.env.REFRESH_EXPIRY
        }
    )
}

const User = mongoose.model<IUser>("User", userSchema)

export default User