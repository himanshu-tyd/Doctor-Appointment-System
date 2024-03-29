const express = require("express");
const router = express.Router();
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("../database/connection");
const User = require("../models/user-schema");

router.get("/", (req, res) => {
  res.send("Hello from router js");
});

/* Using Async await */

router.post("/signup", async (req, res) => {
  const { name, email, work, password, cpassword } = req.body;

  if (!name || !email || !work || !password || !cpassword) {
    res.status(422).json({ error: "please enter all details" });
  }

  try {
    const userExits = await User.findOne({ email: email });

    if (userExits) {
      res.json({ error: `Email already Exits` });
    } else if (password != cpassword) {
      res.status(422).json({ error: "password does not match" });
    }
    const user = new User({ name, email, work, password, cpassword });

    //here we call password dicription method to hash the password

    const userSave = await user.save();

    if (userSave) {
      res.status(201).json({ message: `Data save succesfully` });
    } else {
      res.status(500).json({ messsage: `failed` });
    }
  } catch (error) {
    console.log(error);
  }

  // Additional logic for signup if needed
  // ...

  // If everything is okay, send a success respons
});

// login routes

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Pls fill the blanks" });
    }

    const userLogin = await User.findOne({ email: email });
    const isMatch = await bycrpt.compare(password, userLogin.password);

    if (userLogin && isMatch) {
      const token = await userLogin.generateAuthToken();
      console.log(token);
      res.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly:true
      });
      res.status(200).json({message:`Login Successfully`})
    } else {
      res.status(400).json({ error: "User Email and Password does not match" });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
