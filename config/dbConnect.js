const { default: mongoose } = require("mongoose");
 async function dbConnect() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
             useNewUrlParser: true,
            useUnifiedTopology: true,
            
        }) ;
        // console.log(conn);
        console.log("Database connected successfully");
    }
    catch (error) {
        console.log(error)
        throw new Error("Database failed to connect");
        
    } 
} 
module.exports =  dbConnect;