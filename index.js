import express from "express";
import mongoose from "mongoose";
require("dotenv").config();

const app = express();
const port = process.env.PORT || 8000;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connection with MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/studentRecords")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("Mongo Error", error);
  });

// Studnet Schema
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    grade: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

const StudentUser = mongoose.model("StudentUser", studentSchema);

// const studnetList = [
//   { id: 1, name: "bijay", grade: 1 },
//   { id: 2, name: "bijay", grade: 2 },
//   { id: 3, name: "bijay", grade: 3 },
//   { id: 4, name: "bijay", grade: 4 },
// ];

// Get
app.get("/studentusers", async (req, res) => {
  const allDbStudnetUsers = await StudentUser.find({});
  console.log(allDbStudnetUsers);
  const makeResponse = `
  <ul>
  ${allDbStudnetUsers.map((user) => `<li>${user.name} - ${user.email}</li>`)}
  </ul>
  `;
  res.send(makeResponse);
});

// Get
app.get("/studentusers/:id", async (req, res) => {
  const { id } = req.params;
  const isIDExist = await StudentUser.findById(id);
  if (isIDExist) {
    res.json({
      message: "task exist",
      data: isIDExist,
    });
  } else {
    res.json({
      message: "data not found",
    });
  }
});

// POST | create
app.post("/studentusers", async (req, res) => {
  const { name, grade, gender, email, age } = req.body;
  if (!name || !grade || !gender || !email || !age) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const result = await StudentUser.create({
    name,
    grade,
    gender,
    email,
    age,
  });
  //   console.log("result", result);
  return res.status(201).json({
    message: "student added",
  });
});

// Update | Patch |Put
app.put("/studentusers/:id", async (req, res) => {
  const { id } = req.params;
  await StudentUser.findByIdAndUpdate(id, {
    name: "changed",
  });

  res.json({
    msg: "detail updated",
  });
});

// Delete
app.delete("/studentusers/:id", async (req, res) => {
  const { id } = req.params;
  await StudentUser.findByIdAndDelete(id);

  res.json({
    msg: "delete Successful",
  });
});

// Start server
app.listen(port, (error) => {
  error
    ? console.log("Something went wrong")
    : console.log("You server is running in http://localhost:" + port);
});
