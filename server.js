const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const MONGO_URI = require("dotenv").config();
console.log(typeof MONGO_URI.parsed.MONGO_URI)



const app = express();
const port = process.env.PORT || 3001;

// body parser middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

var whitelist = ["https://radiant-harbor-87919.herokuapp.com", 'http://localhost:3000']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}
 



app.use(cors(corsOptions));
app.use(cookieParser());

//set an static route to show the images

app.use("/images", express.static(__dirname + "/uploads/images"));

// Import URI Mlab

// const DB = require("./config/keys");
// console.log(DB.mongoURI);

// URI to connect to local DB
// 'mongodb://localhost:27017/cocktail-app-MVC-copy'



mongoose
  .connect(MONGO_URI.parsed.MONGO_URI, { useNewUrlParser: true })
  .then(console.log("Successful connection to database"))
  .catch(error => {
    console.log(`The following error occurred: ${error.message}`);
  });

//requiring routes

const routes = require("./routes/api/index");



//Use Routes
app.use("/", routes);

app.listen(port, () => console.log(`server started on port ${port}`));
