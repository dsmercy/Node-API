const express = require('express');
const app = express();

const dotenv = require('dotenv');
const connectDatabase = require('./config/database');
const apiResponse = require("./helpers/apiResponse");

const errorMiddleware = require('./middlewares/errors');

// Setting up config.env file variables
dotenv.config({ path: './config/config.env' })

// Setup body parser
app.use(express.json());

// Connecting to databse
connectDatabase();

// Importing all routes
const jobs = require('./routes/jobsRoute');
const auth = require('./routes/authRoute');

app.use('/api/v1', jobs);
app.use('/api/v1', auth);
// Handle unhandled routes
app.all('*', (req, res, next) => {
    return apiResponse.notFoundResponse(res, `provided route: ${req.url} not found`);
    next();
});

// Global Error Handling Middleware
app.use(errorMiddleware);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});