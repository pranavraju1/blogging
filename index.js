const express = require("express");
const clc = require("cli-color");
require("dotenv").config();
const session = require("express-session");
const mongoDbSession = require("connect-mongodb-session")(session);

//file-imports
require("./db");
const AuthRouter = require("./Controllers/AuthController");
const BlogRouter = require("./Controllers/BlogControler");
const isAuth = require("./Middlewares/AuthMiddleware");
const FollowRouter = require("./Controllers/FollowController");
const cleanUpBin = require("./cron");

//constants
const app = express();
const PORT = process.env.PORT;
const store = new mongoDbSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});
//middleware
// /auth/register should go to auth router and /blog should go to blog router
app.use(express.json());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use("/auth", AuthRouter);
app.use("/blog", isAuth, BlogRouter);
app.use("/follow", isAuth, FollowRouter);

app.listen(PORT, () => {
  console.log(
    clc.yellowBright.underline(`Blogging server is running port: ${PORT}`)
  );
  cleanUpBin();
});
