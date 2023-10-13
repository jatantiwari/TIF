
const mongoose = require('mongoose')
const database = "mongodb+srv://it20203068:XGhQOhR733Laa2Oe@cluster0.rhwd112.mongodb.net/tifdata?retryWrites=true&w=majority"

const connectToDatabase = async () => {
    try {
        
        mongoose.set('strictQuery', false)
        mongoose.connect(database) 
        console.log('Mongo connected')
    } catch(error) {
        console.log(error.message)
        process.exit()
    }
}
//exporting database
module.exports = connectToDatabase
