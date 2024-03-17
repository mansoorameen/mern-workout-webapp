const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.signup = async function (email, password) {
  // validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  } else if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  } else if (!validator.isStrongPassword(password)) {
    throw Error("Enter a strong password");
  }

  console.log("first");
  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already in use");
  }
  console.log("sec");
  // salts adds extra random characters to the password for extra safety
  // if two passwords are same, as salt is different the final hash will also be different
  // so if one password is cracked, the other is safe
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ email, password: hash });

  return user;
};

module.exports = mongoose.model("User", userSchema);
