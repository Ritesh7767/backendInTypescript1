import express, { NextFunction, Request, Response } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import ApiError from './utils/apiError'

const app = express()

const whitelist = process.env.WHITELIST?.split(',')

const corsOptions = {
    origin : (origin: string | undefined, callback : (err : Error | null, allow? : boolean) => void) => {
        if(!origin || whitelist?.includes(origin)) callback(null, true)
        else callback(new ApiError(403, 'Not authorized by CORS policy'))
    }
}

app.use(cors(corsOptions))
app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended : true, limit : '16kb'}))
app.use(express.static('public'))
app.use(cookieParser())

import userRouter from './routers/user.router'

app.use('/api/v1/user', userRouter)

import productRouter from './routers/product.router'

app.use('/api/v1/product', productRouter)


app.use((err : Error, req : Request, res : Response, next : NextFunction) => {
    if(err instanceof ApiError){
        res.status(err.statusCode).json({
            success : false,
            message : err.message,
            errors : err.errors,
            data : err.data
        })
    }
    else {
        res.status(500).json({
            success : false,
            message : "Internal Server Error",
            errors : [],
            data : null
        })
    }
})


export default app