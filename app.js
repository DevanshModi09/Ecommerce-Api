require('dotenv').config();
const connectDB = require('./db/connect');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
//Express
const express = require('express');
const app = express();
//Other packages
const morgan = require('morgan');

//Middlewares
app.use(morgan('tiny'));
app.use(express.json());

//  404 not found and Error handlers
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

//Starting the server ;
const port = process.env.PORT || 5001;
const start = async (params) => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port : ${port}`);
    });
  } catch (err) {}
};
start();
