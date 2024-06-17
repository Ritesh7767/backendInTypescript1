import mongoose from "mongoose"

const ConnectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
        console.log('Database connection successfully at host', connectionInstance.connection.host)
    }
    catch(err){
        console.log('Failed to connectDatabase', err)
        process.exit(1)
    }
}

export default ConnectDB