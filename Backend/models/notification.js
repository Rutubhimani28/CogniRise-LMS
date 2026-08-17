import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    type: { type: String, required: [true, "Type required."] },
    courseId: { type: mongoose.Schema.Types.ObjectId, default: null },
    courseName: { type: String, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    notificationView: [{ type: String, default: [] }],
    clearNotification: [{ type: String, default: [] }],
    createdAt: { type: Date, default: new Date().toISOString() },
  }
);

export default mongoose.model("Notification", notificationSchema);
