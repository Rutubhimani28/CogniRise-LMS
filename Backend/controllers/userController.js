import User from "./../models/user";
import fs from 'fs';
import { uploadfile } from '../middlewares/image-uploader';

export const getAllUsers = async (query) => {
  return await User.find(query);
};

export const getOneUser = async (id) => {
  let user = await User.findById(id);
  let res = user.toObject();
  delete res.password;
  return res;
};

export const addUser = async (user) => {
  return await User.create(user);
};

export const updateUser = async (req, res) => {
  try {
    const userData = req.body;
    let foundUser = await User.findById(userData._id);

    if (!foundUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Handle password update
    if (userData.password) {
      if (!foundUser.validPassword(userData.oldPassword)) {
        return res.status(400).json({ error: "Incorrect old password" });
      }
      foundUser.password = foundUser.encryptPassword(userData.password);
    }

    // Handle file upload
    if (req.files && req.files.profile) {
      const file = req.files.profile;
      // Create temp directory if it doesn't exist
      if (!fs.existsSync('./public/temp')) {
        fs.mkdirSync('./public/temp', { recursive: true });
      }

      const tempPath = `./public/temp/${file.name}`;

      try {
        await file.mv(tempPath);
        const uploadResult = await uploadfile(tempPath, 'profile', 'image');
        // Initialize profile object if it doesn't exist
        if (!foundUser.profile) {
          foundUser.profile = {};
        }
        // Update profile image URL
        foundUser.profile.profileImg = uploadResult.secure_url;

        // Delete temp file
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      } catch (fileError) {
        console.error('File processing error:', fileError);
        return res.status(500).json({ error: 'File upload failed' });
      }
    }

    // Handle other profile updates
    if (userData.profile) {
      foundUser.profile = {
        ...foundUser.profile,
        ...userData.profile
      };
    }

    // Save the updated user
    const updatedUser = await User.findByIdAndUpdate(
      userData._id,
      foundUser,
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error in updateUser:', err);
    res.status(400).json({ error: err.message });
  }
};

export const deleteUser = async (id) => {
  return await User.findOneAndRemove({ _id: id });
};
