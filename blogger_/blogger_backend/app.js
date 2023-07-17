// using require for importing modules in node.js
const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const blogsRoutes = require("./routes/blogs-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

app.use(bodyParser.json());

// express just return the requested file and we don't execute it
// it will serve any files from this folder
app.use("/uploads/images",express.static(path.join("uploads","images")))

// add certain headers against CORS
// CORS is browser related issue
// and by adding headers the browser accepts the response
// postman don't care about the headers
app.use((req, res, next) => {
  // which domain should access the backend server
  res.setHeader("Access-Control-Allow-Origin", "*");
  // which header the request send by browser can have
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  // the methods that are allowed for the incoming requests
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/blogs", blogsRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
  throw new HttpError("Couldn't find the requested page!", 404);
});

app.use((error, req, res, next) => {
  if(req.file ){
    // delete the file
    fs.unlink(req.file.path,(err)=>{console.log(err)})
  }
  // we check whether a response has already been sent
  if (res.headerSent) {
    // forward the error to the next error handling middleware function
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Unknown error occured!" });
});
// 8gllHWy76H7TsML3
mongoose
  .connect(
    `mongodb+srv://sanjaykannu27:8gllHWy76H7TsML3@cluster0.dm6mz8y.mongodb.net/blogs?retryWrites=true&w=majority`
    // `mongodb+srv://Sanjay:Sanjay@cluster0.yu4vq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(5000 );
  })
  .catch((err) => console.log(err));