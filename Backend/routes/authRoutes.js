import express from "express";
import { validateSignup, validateSignin } from "./../middlewares/validator";
import User from "./../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendMail } from "./../middlewares/sendMail";
import jwt_decode from "jwt-decode";
dotenv.config();

const router = express.Router();

router.post("/signup", async (req, res) => {
  const reqUser = req.body;

  // Validation
  const { errors, isValid } = validateSignup(reqUser);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  //Create a new user in the db
  try {
    const user = await User.findOne({ email: reqUser.email });
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    }
    const newUser = await new User({ ...reqUser });
    newUser.password = newUser.encryptPassword(reqUser.password);
    await newUser.save();

    // Create and send the JWT token
    jwt.sign(
      { email: newUser.email },
      process.env.SECRET_KEY,
      {
        expiresIn: 31556926, // 1 year in seconds
      },
      (err, token) => {
        res.send({
          token: token,
          userData: {
            id: newUser._id,
            role: newUser.role,
            status: newUser.status,
          },
        });
        const link = `${process.env.BASE_URL}/email-verification/${token}`;
        sendMail(newUser.email, link);
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.post("/login", async (req, res) => {
  const reqUser = req.body;

  // Validation
  const { errors, isValid } = validateSignin(reqUser);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = reqUser.email;
  const password = reqUser.password;

  // Find user
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "Email not found" });
    if (!user.validPassword(password)) {
      return res.status(400).json({ error: "Incorrect password" });
    }
    if (user.status === "notVerify")
      return res
        .status(404)
        .json({ error: "please verify your email address" });

    // Create and send the JWT token
    jwt.sign(
      { email },
      process.env.SECRET_KEY,
      {
        expiresIn: 31556926, // 1 year in seconds
      },
      (err, token) => {
        res.send({
          token: token,
          userData: { id: user._id, name: user.profile.name, role: user.role },
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.toString() });
  }
});

router.put("/verifyEmail", async (req, res) => {
  const { token, status } = req.body;
  console.log("token", token);
  const decoded = jwt_decode(token);
  const email = decoded.email;
  console.log("email", email);

  const findUser = await User.findOne({ email });
  if (!findUser) {
    res.status(404);
    return res.json({ message: "the email provided was not found" });
  } else if (findUser) {
    findUser.status = status;
    const userDetail = await User.findByIdAndUpdate(findUser._id, findUser);
    return res.json(userDetail);
  } else {
    res.status(500);
    return res.json({ message: "Internal Server Error" });
  }
});

router.put("/updatePassword", async (req, res) => {
  const { id, oldPassword, password, confirmPassword } = req.body;

  // check old password and updating the profile or the password
  let foundUser = await User.findById(id);

  if (oldPassword) {
    // check if the old password matches the one in the db
    if (!foundUser.validPassword(oldPassword)) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    // check old password matches new password the one in the db
    if (oldPassword === password) {
      return res
        .status(400)
        .json({ message: "Old password and New password is same" });
    }
    //check password match confirm password and update
    if (password === confirmPassword) {
      foundUser.password = foundUser.encryptPassword(password);
      const userDetail = await User.findByIdAndUpdate(foundUser._id, foundUser);
      return res.json(userDetail);
    }
  }
});
export default router;
