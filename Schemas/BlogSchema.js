const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  textBody: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 500,
  },
  creationDateTime: {
    type: Date, //if string will be sorted alphabetically
    required: true,
  },
  userId: {
    // userId here is a foreign key(fk) to userschema
    //incase of ObjectId this is the type that should be given (refer to mongoose documentation)
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
    // this is how you create a foreign key
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  deletionDateTime: {
    type: Date,
    require: false,
  },
});

module.exports = mongoose.model("blog", BlogSchema);
