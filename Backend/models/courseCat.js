import mongoose from "mongoose";
const Schema = mongoose.Schema;

const courseCategoriesSchema = Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  createdName: { 
    type: String,
    require: false,
  },
  createdBy: { 
    type: mongoose.Schema.ObjectId, 
    ref: "User", 
    required: true 
  },
  status: {
    type: String,
    require: true,
  },
  approvals: {
    type: String,
    default: "pending", 
    require: true,
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    required: true 
  },
});

export default mongoose.model("Course_Categories", courseCategoriesSchema);