import mongoose from "mongoose";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;

const userSchema = Schema({
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  bio: {
    type: String,
    require: false,
  },
  profileImg: {
    type: String,
    require: false,
  },
  socialLink: {
    type: Object,
    require: false,
  },
  otherInfo: {
    type: Object,
    require: false,
  },
  role: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    default: "approve", 
    require: true,
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    required: true 
  },
});

// encrypt the password before storing
userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
};

userSchema.methods.validPassword = function (candidatePassword) {
  if (this.password != null) {
    return bcrypt.compareSync(candidatePassword, this.password);
  } else {
    return false;
  }
};

export default mongoose.model("User", userSchema);
