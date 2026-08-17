import mongoose from "mongoose";
import Course from "../models/course";
import Enrollment from "../models/enrollment";

export const getAllCourse = async (query) => {
  return await Course.find(query);
};

export const getStudentCourse = async (query) => {
  const skipCourse = Object.values(query);
  return await Course.find({
    $and: [
      { _id: { $nin: skipCourse } },
      { status: { $nin: ["pending", "draft"] } },
    ],
  });
};

export const searchCourse = async ({ title }) => {
  return await Course.find({ title: { $regex: ".*" + title + ".*" } });
};

export const Setlevel = async (filter) => {
  return await Course.find(filter);
};

export const getCourseLength = async (query) => {
  return await Course.find(query).count();
};

export const getOneCourse = async (id) => {
  return await Course.findById(id);
};

export const addCourse = async (course) => {
  return await Course.create(course);
};

export const updateCourse = async (course) => {
  return await Course.findByIdAndUpdate(course._id, course);
};

export const deleteCourse = async (id) => {
  return await Course.findOneAndRemove({ _id: id });
};

export const deleteAllCourse = async (ids) => {
  return await Course.deleteMany({ _id: { $in: ids } });
};

export const getCourseCount = async (id) => {
  return await Course.aggregate([
    {
      $match: {
        createdBy: mongoose.Types.ObjectId(id.id),
        status: "approve",
      },
    },
    {
      $count: "total",
    },
  ]);
};
