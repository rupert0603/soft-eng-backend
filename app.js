const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
// const tourRouter = require('./routes/tourRoutes');
const userRouter = require("./routes/userRoutes");
const shopRouter = require("./routes/shopRoutes");
const productRouter = require("./routes/productRoutes");
const orderRouter = require("./routes/orderRoutes");

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// app.use('/api/v1/tours', tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/shop", shopRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/orders", orderRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
