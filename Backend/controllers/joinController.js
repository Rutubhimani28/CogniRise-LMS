import User from "../models/user";


export const createJoinCourse = async () => {
  return await User.find({});
};

export const updateUser = async (user) => {
  let res;
  //check if the user is updating the profile or the password
  if (user.password) {
    const foundUser = await User.findById(user._id);
    //check if the old password matches the one in the db
    if (!foundUser.validPassword(user.oldPassword)) {
      throw new Error("Incorrect old password");
    }
    //encrypt the password
    foundUser.password = foundUser.encryptPassword(user.password);
    res = await User.findByIdAndUpdate(user._id, foundUser);
  } else {
    res = await User.findByIdAndUpdate(user._id, user);
  }
  return res;
};

