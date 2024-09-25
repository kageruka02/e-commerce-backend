const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/authRoute');
const bodyParser = require("body-parser");
async function startServer() {
    try {
        await dbConnect();
        app.use('/', (req, res) => {
    res.send("Hello from server side");
})



app.listen(PORT, () => {
    console.log('Server is running on the port ' + PORT);
})
        
    }
     catch (error) {
        console.error("Failed to start server: ", error);
    }
}
app.use(express.json());
app.use('/api/user', authRouter);
startServer();
