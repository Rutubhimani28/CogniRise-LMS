import CourseCat from "../models/courseCat";

export const getAllCourseCat = async (query) => {
  return await CourseCat.find(query);
};

export const getOneCourseCat = async (id) => {
  return await CourseCat.findById(id);
};

export const addCourseCat = async (courseCat) => {
  return await CourseCat.create(courseCat);
};

export const updateCourseCat = async (courseCat) => {
  return await CourseCat.findByIdAndUpdate(courseCat._id, courseCat);
};

export const deleteCourseCat = async (id) => {
  return await CourseCat.findOneAndRemove({ _id: id });
};

export const deleteManyCat = async (ids) => {
  return await CourseCat.deleteMany({ _id: { $in: ids } });
};
