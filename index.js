const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const { notFound, errorHandler } = require('./middlewares/errorhandler')
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 4000;
const authRouter = require('./routes/userRoute');
const productRouter = require('./routes/productRoute');
const blogRouter = require('./routes/blogRoute');
const ProductCategoryRouter = require('./routes/ProductCategoryRoute');
const blogCategoryRouter = require('./routes/blogCategoryRoute');
const brandRouter = require('./routes/brandRoute');
const couponRouter = require('./routes/couponRoute');
const cookieParser = require('cookie-parser');
const morgan = require("morgan");



async function startServer() {
    try {
        await dbConnect();
  



app.listen(PORT, () => {
    console.log('Server is running on the port ' + PORT);
})
        
    }
     catch (error) {
        console.error("Failed to start server: ", error);
    }
}
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/Pcategory', ProductCategoryRouter);
app.use('/api/Bcategory', blogCategoryRouter);
app.use('/api/brand', brandRouter);
app.use('/api/coupon', couponRouter);
console.log(new Date())

app.use(notFound);
app.use(errorHandler);
startServer();
