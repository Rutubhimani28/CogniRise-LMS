import Enterprise from "../models/enterprise";

export const getAllEnterprise = async (query) => {
  return await Enterprise.find(query);
};

export const getOneEnterprise = async (id) => {
  return await Enterprise.findById(id);
};

export const addEnterprise = async (enterprise) => {
  return await Enterprise.create(enterprise);
};

export const updateEnterprise = async (enterprise) => {
  return await Enterprise.findByIdAndUpdate(enterprise._id, enterprise);
};

export const deleteEnterprise = async (id) => {
  return await Enterprise.findOneAndRemove({ _id: id });
};
