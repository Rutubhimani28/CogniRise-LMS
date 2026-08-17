import Notification from "../models/notification";

export const getNotification = async (param) => {
  const query = { type: { $in: param.type } }
  return await Notification.find(query)
};

export const addNotification = async (notification) => {
  return await Notification.create(notification);
};

export const updateNotification = async (notification) => {
  return await Notification.findByIdAndUpdate(notification._id);
};
