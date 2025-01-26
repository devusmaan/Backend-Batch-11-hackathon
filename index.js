import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.js";


import Beneficiary from "./models/Beneficiary.js";
import nodemailer from "nodemailer";

const { PORT, MONOGO_DB_KEY, privateKey } = process.env;

const app = express();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "unknownusman908@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

mongoose
  .connect(MONOGO_DB_KEY)
  .then(() => {
    console.log("db connected");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(cors("*"));
app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  console.log("Hello World");
});

app.post("/newcustomer", async (req, res) => {
  let data = req.body;

  let token = Math.floor(Math.random() * 100);

  let a = new Beneficiary({
    ...data,
    token,
  });

  let mailOptions = {
    from: "ubaidmuhammad916@gmail.com",
    to: `${data.email}`,
    subject: "Receiption Token",
    text: `\n \n Hello, ${data.name} \n \n \n \n Your Department is ${data.purpose} \n \n \n \n Your Token number is ${token}, Thank you!}`,
  };

  transporter.sendMail(mailOptions, async function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: ");
      await a.save();
      res.send("Added Beneficiary");
    }
  });
});

app.post("/finduser", async (req, res) => {
  let data = await Beneficiary.find({
    $and: [{ purpose: req.body.purpose }, { token: req.body.token }],
  });

  res.send(data);
});

app.post("/update", async (req, res) => {
  let { userid, AssistanceStatus } = req.body;
  console.log(userid, AssistanceStatus);
  let doc = await Beneficiary.findOneAndUpdate(
    { _id: userid },
    { AssistanceStatus: AssistanceStatus }
  );
  console.log(doc);

  if (doc.AssistanceStatus != "Complete") {
    let mailOptions = {
      from: "unknownusman908@gmail.com",
      to: `${doc.email}`,
      subject: "Congrates",
      text: `\n \n Hello, ${doc.name} \n \nYour ${doc.purpose} query has been Completed \n \n Thanks for comming!!`,
    };

    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: ");
        res.send("UPDATED");
      }
    });
  } else {
    res.send("UPDATED");
  }
});

app.get("/getbeneficiary", async (req, res) => {
  try {
    let data = await Beneficiary.find({});
    res.send(data)
  } catch (e) {
    console.log(e);
    res.send(e)
  }
});

app.listen(PORT || 3000, () => {
  console.log("Server is running");
});
