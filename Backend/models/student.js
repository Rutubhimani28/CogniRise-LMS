import mongoose from "mongoose";
const Schema = mongoose.Schema;

const StudentSchema = Schema({
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
  school: {
    type: String,
    require: true,
  },
  yearOfSchool: {
    type: String,
    require: true,
  },
  socialLink: {
    type: Object,
    require: false,
  },
  createdBy: { 
    type: mongoose.Schema.ObjectId, 
    ref: "User", 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    required: true 
  },
});

export default mongoose.model("Student", StudentSchema);