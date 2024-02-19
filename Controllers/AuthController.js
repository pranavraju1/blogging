//we are not creating a diff file for routes we are bringing routs inside controller
const express = require("express"); //to make router
const { validateRegisterData } = require("../Utils/authutils");
const AuthRouter = express.Router();
const UserSchema = require("../Schemas/UserSchema");

AuthRouter.post("/register", async (req, res) => {
  // console.log("register working");
  console.log(req.body);
  const { name, email, password, username } = req.body;
  //cleanup data
  try {
    await validateRegisterData({ name, email, password, username });
  } catch (err) {
    return res.send({
      status: 400,
      message: "Data invalid",
      error: err,
    });
  }

  const userObj = UserSchema({
    name: name,
    email: email,
    password: password,
    username: username,
  });
  try {
    const userDb = await userObj.save();
    console.log("user stored in db", userDb);
    return res.send({
      status: 200,
      message: "Register success",
      data: userDb,
    });
  } catch (err) {
    return res.send({
      status: 500,
      message: "Database Error",
      error: err,
    });
  }

  return res.send("register hits");
});

AuthRouter.post("/login", (req, res) => {
  console.log("login working");
  return res.send("login hits");
});

module.exports = AuthRouter;

//server <----> Router <----> Controller <----> Model <----> Schema
