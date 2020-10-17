const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const app = express();
const router = express.Router();
const config = require("config");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const hpp = require("hpp");
const routes = require("./routes");
const globalErrorHandler = require("./controllers/error");
import { AppError } from "./utils";
const API_PORT = config.get("api-port");

const DB =
  "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.wxjro.mongodb.net/video?retryWrites=true&w=majority";
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// used to enable headers set by heroku req.headers('x-forwaded-proto') === 'https
// app.enable('trust proxy');

//in production we should have a tool in place which will restart the application after crashing and many hosting services do so
process.on("uncaughtRejection", (err) => {
  console.log(err.name, err.message);
  console.log("uncaughtRejection , shutting down");
  process.exit(1);
});

//set security HTTP headers
app.use(helmet());

// Development Logging
// if (process.env.NODE_ENV === 'dev') {
//     app.use(morgan('dev')); //logging
// }

//rate limits request based on IP
// limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 100 requests in 1hr
  message: "To many requests from this IP, please try again in an hour",
});
//status code 429
app.use("/api", limiter);

//if frontend website is hosted on example.com then allow only to it to make call
//otherwise app.use(cors()); to allow api access from anywhere
// app.use(cors({
//     origin: 'https://www.example.com'
// }));

// app.options('*', cors());

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev")); //??

//Body Parser, reading data from body into req.body
// app.use(express.json({limit: '10kb'})); // not allow body greater than 10kb
app.use(cookieParser());

// app.use((req, res, next) => {
//     req.requestTime = new Date().toISOString();
//      console.log(req.cookies);
//     next();
// });

//Data sanitization against NoSQL querry injection
app.use(mongoSanitize());
// to test: send body = {"email": {"$gt" : ""}, password: "password1234"(any common password)}

// Data sanitization against XSS
app.use(xss());
// this will clean any user input from malicious html code
// to test: body = {"name": "<div>sajdksjdk</div>"}

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["duration"], // it will allow duration to be duplicate
  })
);
// this will remove duplicate parameters in query string eg: v1/tours?sort=duration&sort=price so it will sort by price

// app.use((req,res,next) => {
//     console.log('hello');
//     next();
// });
app.use("/api", routes);

app.use(compression()); // compress all the text sent to client i.e text or json

// append /api for our http requests
// app.use("/api/v1/users", dataRouter);

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //     status: 'fail',
  //     message: `Cant find ${req.originalUrl} on this server`
  // });
  //instead of this we are doing
  console.log("all");
  next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
app.on("error", (err) => console.error(err));

// launch our backend into a port
const server = app.listen(API_PORT, () =>
  console.log(`Listening on Port ${API_PORT}`)
);

//errors occuring outside express like connecting to mongoose
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("unhandledRejection , shutting down");
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED, shutting down gracefully ");
  //sigterm will automatically shutdown application so we dont need to do process.exit(1)
  server.close(() => {
    console.log("Process terminated");
  });
});
