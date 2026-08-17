import mongoose from "mongoose";
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;

const enrollmentSchema = Schema({
  studentID: { 
    type: mongoose.Schema.ObjectId, 
    ref: "User", 
    required: true 
  },
  courseID: { 
    type: mongoose.Schema.ObjectId, 
    ref: "Course", 
    required: true 
  },
  enterpriseID: { 
    type: mongoose.Schema.ObjectId, 
    ref: "Enterprise", 
    required: true 
  },
  status: {
    type: String, //[Ongoing, Completed]
    require: true,
  },
  totalTask: {
    type: Number,
    require: true,
  },
  completeTask: {
    type: Array,
    require: false,
  },
  completeTaskDuration: {
    type: Number,
    default: 0,
    require: false,
  },
  rating: { 
    type: String,
    required: false 
  },
  enrollmentDate: { 
    type: Date, 
    default: Date.now, 
    required: true 
  },
  completeDate: { 
    type: String,
    required: false 
  },
});

export default mongoose.model("Enrollment", enrollmentSchema);
