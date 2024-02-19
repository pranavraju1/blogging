const express = require("express");
const clc = require("cli-color");
const AuthRouter = require("./Controllers/AuthController");
require("dotenv").config();

//file-imports
require("./db");

//constants
const app = express();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  return res.send({
    status: 200,
    message: "server is up and running",
  });
});

//middleware
// /auth/register should go to auth router and /blog should go to blog router
app.use(express.json());
app.use("/auth", AuthRouter);

app.listen(PORT, () => {
  console.log(
    clc.yellowBright.underline(`Blogging server is running port: ${PORT}`)
  );
});
