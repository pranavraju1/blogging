//we are not creating a diff file for routes we are bringing routs inside controller
const express = require("express"); //to make router
const { validateRegisterData } = require("../Utils/authutils");
const AuthRouter = express.Router();
const UserSchema = require("../Schemas/UserSchema");
const User = require("../Models/UserModle");
const bcrypt = require("bcrypt");
const isAuth = require("../Middlewares/AuthMiddleware");

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

  // creating user
  try {
    await User.usernameAndEmailExists({ email, username }); //this is hpw you call a static function
    const userobj = new User({ name, email, username, password }); //create an object in model calss
    const userDb = await userobj.register(); //creating user in db
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
});

AuthRouter.post("/login", async (req, res) => {
  const { loginId, password } = req.body;
  if (!loginId || !password)
    return res.send({
      status: 400,
      message: "Missing credentails",
    });

  // find the user in db and comparing pw
  try {
    const userDb = await User.findUserWithLoginId({ loginId });

    //compare the password
    const isMatched = await bcrypt.compare(password, userDb.password);
    if (!isMatched) {
      return res.send({
        status: 400,
        message: "Invalid password",
      });
    }

    console.log(req.session);
    // over here we are storing the schema w/o creating a schema this is not recomended
    req.session.isAuth = true;
    req.session.user = {
      email: userDb.email,
      username: userDb.username,
      userId: userDb._id,
    };
    return res.send({
      status: 200,
      message: "Login successful",
    });
  } catch (err) {
    return res.send({
      status: 500,
      message: "Database Error",
    });
  }

  //if true make session based auth
});

AuthRouter.post("/logout", isAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.send({
        status: 400,
        message: "Logout not successfull",
      });
  });
  return res.send({
    status: 200,
    message: "Logout successful",
  });
});

module.exports = AuthRouter;

//server <----> Router <----> Controller <----> Model <----> Schema
//class, functions
