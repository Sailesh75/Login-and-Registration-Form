const express = require("express");
const router = express.Router();
const Registration = require("../models/registration"); //db model
const bcrypt = require("bcryptjs");

//render hbs pages
router.get("/", async (req, res) => {
  res.render("login");
});

router.get("/recover", async (req, res) => {
  try {
    res.render("recover");
  } catch (error) {
    console.error(error);
  }
});

router.get("/register", async (req, res) => {
  try {
    res.render("register");
  } catch (error) {
    console.error(error);
  }
});

//get all users
router.get("/users", async (req, res) => {
  const records = await Registration.find();
  res.status(422).json(records);
});

//register form (create api)
router.post("/register", async (req, res) => {
  const { name, email, phone, password, confirmpassword } = req.body;
  if (!name || !email || !phone || !password || !confirmpassword) {
    return res.status(422).json({ error: "Please fill all the forms!!" });
  }
  try {
    const userExits = await Registration.findOne({ email });
    let num = phone.toString().length;
    if (userExits) {
      return res.status(422).json({ error: "User already exists!!" });
    } else if (num < 10) {
      return res.status(422).json({ error: "Phone number Invalid!!" });
    } else if (password !== confirmpassword) {
      return res.status(422).json({ error: "Passwords doesn't match!!" });
    } else {
      const user = new Registration({
        name,
        email,
        phone,
        password,
        confirmpassword,
      });
      await user.save();
      res.status(201).render("welcome");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
});

//login form (create api)
router.post("/login", async (req, res) => {
  const { name, password, confirmpassword } = req.body;
  if (!name || !password) {
    return res.status(422).json({ error: "Please fill all the forms!!" });
  }
  try {
    const userExits = await Registration.findOne({ name });
    const isMatch = bcrypt.compare(password, confirmpassword);
    if (userExits) {
      if (isMatch) {
        return res.status(201).json({ message: "Login Successful!!" });
        // res.render("welcome");
      } else {
        return res.status(422).json({ error: "Password Incorrect!!" });
      }
    } else {
      return res.status(422).json({ error: "User doesn't exist!!" });
    }
  } catch (err) {
    console.log(err);
    s;
  }
});

//change form detail (update api)
router.put("/records/:id", async (req, res) => {
  let record = await Registration.findById(req.params.id);
  if (!record) {
    res.status(200).json({
      sucess: false,
      message: "Record not found",
    });
  }
  record = await Registration.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: true,
    runValidators: true,
  });

  res.status(200).json({ sucess: true });
});

//delete api
router.delete("/records/:id", async (req, res) => {
  let record = await Registration.findById(req.params.id);
  if (!record) {
    res.status(200).json({
      sucess: false,
      message: "Record not found",
    });
  }
  await record.remove();
  res.status(200).json({
    sucess: true,
    message: "Record deleted succesfully",
  });
});

module.exports = router;
