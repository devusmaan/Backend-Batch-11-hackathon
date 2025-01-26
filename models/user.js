
import mongoose, { Types } from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  role : {type : String , enum : ["Receptionist", "Department Staff" ,"Admin"]},
});

const User = mongoose.model("TaskUsers", userSchema);

export default User;