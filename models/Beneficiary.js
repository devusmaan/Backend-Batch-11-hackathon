import mongoose, { Types } from "mongoose";
const { Schema } = mongoose;

const beneficiarySchema = new Schema({
  city: String,
  province: String,
  name: String,
  email: String,
  address: String,
  cnic: String,
  contact: Number,
  purpose: String,
  token: Number,
  AssistanceStatus: { type: String, default: "In Progress" },
  date: { type: Date, default: Date.now() },
});

const Beneficiary = mongoose.model("Beneficiarys", beneficiarySchema);

export default Beneficiary;
