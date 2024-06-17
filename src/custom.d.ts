import Express from 'express'

declare global {
    namespace Express {
        interface Request {
            _id : mongoose.Schema.Types.ObjectId
        }
    }
}