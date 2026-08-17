import mongoose from "mongoose";
const Schema = mongoose.Schema;

const enterpriseSchema = Schema({
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
  companySize: {
    type: String,
    require: false,
  },
  category: {
    type: String,
    require: false,
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

export default mongoose.model("Enterprise", enterpriseSchema);