import mongoose from "mongoose";
const Schema = mongoose.Schema;

const courseSchema = Schema(
  {
    title: {
      type: String,
      require: true,
    },
    slug: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: false,
    },
    banner: {
      type: Array,
      require: false,
    },
    category: {
      type: String,
      require: false,
    },
    tags: {
      type: Array,
      require: false,
    },
    preRequisites: {
      type: Array,
      require: false,
    },
    courseLength: {
      type: String,
      require: false,
    },
    price: { type: Number, required: true },
    level: {
      type: String,
      require: false,
    },
    modules: {
      type: Array,
      require: false,
    },
    totalItems: {
      type: Number,
      require: false,
    },
    price: { type: Number, required: false },
    createdName: {
      type: String,
      require: false,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      require: true,
    }, // "draft", "pending", "approve"
    approvals: {
      type: String,
      default: "pending",
      require: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { minimize: false }
);

export default mongoose.model("Course", courseSchema);
