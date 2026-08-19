import mongoose from "mongoose";
import Enrollment from "../models/enrollment";

export const getAllEnrollment = async (query) => {
  return await Enrollment.find(query);
};

export const getOneEnrollment = async (id) => {
  return await Enrollment.findById(id);
};

export const getGraduateStudent = async (id) => {
  return await Enrollment.aggregate([
    {
      $match: {
        $and: [
          { status: "pending" },
          { enterpriseID: mongoose.Types.ObjectId("63f70c4f8ebaa93a49501cbe") },
        ],
      },
    },
    {
      $group: {
        _id: "$studentID",
      },
    },
    {
      $group: {
        _id: null,
        count: { $count: {} },
      },
    },
  ]);
};

export const getStudent = async (id) => {
  return await Enrollment.aggregate([
    {
      $match: {
        enterpriseID: mongoose.Types.ObjectId("63f70c4f8ebaa93a49501cbe"),
      },
    },
    {
      $group: {
        _id: "$studentID",
      },
    },
    {
      $group: {
        _id: null,
        count: { $count: {} },
      },
    },
  ]);
};

export const getEnrollmentStudent = async (id) => {
  // return await Enrollment.find({enterpriseID: "63f70c4f8ebaa93a49501cbe"});
  return await Enrollment.aggregate([
    {
      $match: {
        enterpriseID: mongoose.Types.ObjectId("63f70c4f8ebaa93a49501cbe"),
      },
    },
    {
      $group: {
        _id: null,
        count: { $count: {} },
      },
    },
  ]);
};

export const getAllStudent = async () => {
};

export const getCurrentCourse = async (uid) => {
  return await Enrollment.aggregate([
    {
      $match: {
        studentID: mongoose.Types.ObjectId("63f70aa88ebaa93a49501ca3"),
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "courseID",
        foreignField: "_id",
        as: "course_details",
      },
    },
    { $sort: { enrollmentDate: -1 } }, // 1 or -1 to specify an ascending or descending
  ]);
};

export const getEnrollCourse = async (params) => {
  return await Enrollment.aggregate([
    {
      $match: {
        studentID: mongoose.Types.ObjectId(params.studentID),
      },
    },
    {
      $lookup: {
        from: "courses",
        localField: "courseID",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: "$course",
    },
    {
      $addFields: {
        course_id: "$course._id",
        course_title: "$course.title",
        course_slug: "$course.slug",
        course_enterprise: "$course.createdName",
        course_modules: "$course.modules",
      },
    },
    {
      $project: {
        status: 1,
        totalTask: 1,
        completeTask: 1,
        course_id: 1,
        course_title: 1,
        course_slug: 1,
        course_enterprise: 1,
        course_modules: 1,
      },
    },
  ]);
};

export const addEnrollment = async (enrollment) => {
  const course = await Enrollment.findOne({ studentID: enrollment.studentID, courseID: enrollment.courseID })

  if (course) {
    return { status: 400, message: "Course Already Enrolled" };
  }
  if (!course) {
    return await Enrollment.create(enrollment)
  }
};

export const getLastEnrollment = async (enrollment) => {
  let id = mongoose.Types.ObjectId(enrollment);
  return await Enrollment.aggregate(
    [
      {
        $match: {
          _id: id,
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseID",
          foreignField: "_id",
          as: "course_details",
        },
      },
      {
        $unwind: "$course_details",
      },
      {
        $project: {
          _id: 1.0,
          courseID: 1.0,
          totalTask: 1.0,
          completeTaskDuration: 1.0,
          "course_details.title": 1.0,
        },
      },
    ],
    {
      allowDiskUse: false,
    }
  );
};

export const updateEnrollment = async (enrollment) => {
  return await Enrollment.findByIdAndUpdate(enrollment._id, {
    rating: enrollment.rating,
  });
};

export const updateCompleteTask = async (params) => {
  return await Enrollment.updateOne(
    {
      studentID: mongoose.Types.ObjectId(params.studentID),
      courseID: mongoose.Types.ObjectId(params.courseID),
    },
    {
      $set: {
        completeTask: params.completeTask,
        completeTaskDuration: params.completeTaskDuration,
        status: params.status ? params.status : "Ongoing",
      },
    }
  );
};

export const updateStatus = async (params) => {
  return await Enrollment.updateOne(
    {
      studentID: mongoose.Types.ObjectId(params.studentID),
      courseID: mongoose.Types.ObjectId(params.courseID),
    },
    {
      $set: {
        status: params.status,
      },
    }
  );
};

export const deleteEnrollment = async (id) => {
  return await Enrollment.findOneAndRemove({ _id: id });
};

export const countEnrollment = async () => {
  return await Enrollment.find().countDocuments();
};

export const countTotalStudent = async (id) => {
  return await Enrollment.aggregate(
    [
      { $match: { enterpriseID: mongoose.Types.ObjectId(id.id) } },
      { $group: { _id: "$studentID" } },
      { $count: "count" },
    ],
    { allowDiskUse: false }
  );
};

export const getGraduateTotalStudent = async (id) => {
  return await Enrollment.aggregate(
    [
      {
        $match: {
          status: "Completed",
          enterpriseID: mongoose.Types.ObjectId(id.id),
        },
      },
      { $count: "total" },
    ],
    {
      allowDiskUse: false,
    }
  );
};

export const topCourse = async (id) => {
  return await Enrollment.aggregate(
    [
      {
        $match: {
          enterpriseID: mongoose.Types.ObjectId(id.id),
        },
      },
      {
        $sort: {
          status: 1.0,
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseID",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      { $group: { _id: null, items: { $addToSet: "$course" } } },
    ],
    {
      allowDiskUse: false,
    }
  );
};

// viwer API
export const viewerUser = async ({ enterpriseID }) => {
  return await Enrollment.aggregate([
    { $match: { enterpriseID: mongoose.Types.ObjectId(enterpriseID) } },
  ]);
};

//comple graduation
export const compleGraduationUsers = async ({ enterpriseID }) => {
  return await Enrollment.aggregate([
    { $match: { enterpriseID: mongoose.Types.ObjectId(enterpriseID) } },
  ]);
};

// month user
export const usersMonth = async ({ enterpriseID }) => {
  return await Enrollment.aggregate([
    { $match: { enterpriseID: mongoose.Types.ObjectId(enterpriseID) } },
  ]);
};
