//the new keyword will dynamically allocate memory in heap and it will call the constructor of that class
//
//ideally  its recomended to make it using functions byt to have a better learinging

const UserSchema = require("../Schemas/UserSchema");
const bcrypt = require("bcrypt");
const ObjectId = require("mongodb").ObjectId;
//we will make it using class
let User = class {
  username;
  name;
  email;
  password;
  constructor({ email, username, name, password }) {
    this.email = email;
    this.username = username;
    this.password = password;
    this.name = name;
  }
  register() {
    return new Promise(async (resolve, reject) => {
      const hashedPassword = await bcrypt.hash(
        this.password,
        Number(process.env.SALT)
      );
      const userObj = new UserSchema({
        name: this.name,
        username: this.username,
        email: this.email,
        password: hashedPassword,
      });

      // saving inside DB
      try {
        const userDb = await userObj.save();
        console.log("user stored in db", userDb);
        resolve(userDb);
      } catch (err) {
        reject(err);
      }
    });
  }

  // static so that it could be used by other
  static usernameAndEmailExists({ email, username }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userExist = await UserSchema.findOne({
          $or: [{ email }, { username }], //$or here means that if i either get email or username it will return that one
        });
        console.log(userExist);
        if (userExist && userExist.email === email) {
          reject("Email already exist");
        }
        if (userExist && userExist.username === username) {
          reject("Username already exist");
        }
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  }

  //for login
  static findUserWithLoginId({ loginId }) {
    return new Promise(async (resolve, reject) => {
      try {
        const userDb = await UserSchema.findOne({
          $or: [{ email: loginId }, { username: loginId }],
        });
        if (!userDb) reject("User is not found, register first");
        resolve(userDb);
      } catch (err) {
        reject(err);
      }
    });
  }

  static findUserWithId({ userId }) {
    return new Promise(async (resolve, reject) => {
      if (!ObjectId.isValid(userId)) reject("invalid UserId format");
      try {
        const userDb = await UserSchema.findOne({ _id: userId });
        if (!userDb) reject(`No user found with id: ${userId}`);
        resolve(userDb);
      } catch (err) {
        reject(err);
      }
    });
  }
};
module.exports = User;
