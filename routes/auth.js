import express from "express";
import User from "../models/user.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import "dotenv/config";

const router = express.Router();

const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role : Joi.string()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required(),
});

router.post("/login", async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);

  if (error)
    return res
      .status(400)
      .json({ error: true, data: null, msg: error.message });

  let user = await User.findOne({ email: value.email }).lean();

  if (user) {
    const isPasswordValid = await bcrypt.compare(value.password, user.password);

    if (!isPasswordValid)
      return res
        .status(400)
        .json({ data: null, error: true, msg: "Invalid Credentials" });

    delete user.password;


    res.status(200).json({
      data: user,
      error: false,
      msg: "'User Login Successfully",
    });
  } else {
    res.status(400).json({
      data: null,
      error: true,
      msg: "User not found",
    });
  }


});

router.post("/signup", async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);

  if (error) return res.status(400).json({ error: true, data: null, msg: error.message });

  let findUser = await User.findOne({ email: req.body.email }).exec();

  if (findUser)
    return res
      .status(400)
      .json({ error: true, data: null, msg: "Email already in use" });

  const hashedPassword = await bcrypt.hash(value.password, 10);
  value.password = hashedPassword;

  let user = new User({ ...value });
  user = await user.save()
  
  delete user.password;

  res.status(200).json({
    data: user,
    error: false,
    msg: "Account Created Sucessfully",
  });
});

export default router;
