require('dotenv').config();
const connectDB = require('./db/connect');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//Routers
const authRouter = require('./routes/authRoutes.js');

//Express
const express = require('express');
const app = express();

//Other packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

//Middlewares
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

//Routes
app.use('/api/v1/auth', authRouter);
//  404 not found and Error handlers
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//Starting the server ;
const port = process.env.PORT || 5001;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port : ${port}`);
    });
  } catch (err) {}
};
start();
