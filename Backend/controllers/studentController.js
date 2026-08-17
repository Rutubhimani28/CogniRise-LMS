import Student from "../models/student";

export const getAllStudent = async (query) => {
  return await Student.find(query);
};

export const getOneStudent = async (id) => {
  return await Student.findById(id);
};

export const addStudent = async (student) => {
  return await Student.create(student);
};

export const updateStudent = async (student) => {
  return await Student.findByIdAndUpdate(student._id, student);
};

export const deleteStudent = async (id) => {
  return await Student.findOneAndRemove({ _id: id });
};
