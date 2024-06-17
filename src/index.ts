import ConnectDB from "./connectDB/connectDB";
import dotenv from 'dotenv'
import app from './app'

dotenv.config()

ConnectDB()
.then(() => {
    app.listen(process.env.PORT || 8080, () => {
        console.log('Server started at port number', process.env.PORT || 8080)
    })
})
.catch(() => {
    console.log('Something went wrong')
})