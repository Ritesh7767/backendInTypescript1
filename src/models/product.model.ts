import mongoose from 'mongoose'

interface products {
    title : string,
    owner : mongoose.Types.ObjectId,
    price? : number,
    color?: string
}

const productSchema = new mongoose.Schema<products>(
    {
        title : {
            type : String,
            required : true,
            trim : true
        },
        owner : {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'User',
            required : true
        },
        price : {
            type : Number,
            default : 0,
            trim : true
        },
        color : {
            type : String,
            default : null,
            trim : true
        }
    },
    {
        timestamps : true,
        versionKey : false
    }
)

const Product = mongoose.model("Product", productSchema)

export default Product