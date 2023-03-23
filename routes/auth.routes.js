const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");

// GET sign up
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

// POST sign up
router.post("/signup", (req, res, next) => {
  // console.log("The form data: ", req.body);
  const saltRounds = 10;

  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).render("auth/signup", {
      errorMessage:
        "All fields are mandatory. Please provide your username, email and password.",
    });
    return;
  }

  // checking for a stong password with RegEx

  // const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  // if (!regex.test(password)) {
  //   res.status(500).render("auth/signup", {
  //     errorMessage:
  //       "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
  //   });
  //   return;
  // }

  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return User.create({
        email,
        // passwordHash => this is the key from the User model
        //     ^
        //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
        passwordHash: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
      res.render("auth/user-profile", userFromDB);
    })
    .catch((error) => {
      // copy the following if-else statement
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).render("auth/signup", { errorMessage: error.message });
      } else if (error.code === 11000) {
        console.log(error);
        res.status(500).render("auth/signup", {
          errorMessage: `there is already an account using the email: ${email}`,
        });
      } else {
        next(error);
      }
    });
});

// GET log in
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

// Put log in

// POST login route ==> to process form data
router.post("/login", (req, res, next) => {
  // console.log("SESSION =====> ", req.session);
  const { email, password } = req.body;

  if (email === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        // user doesn’t exists
        res.render("auth/login", {
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        // login was successful
        req.session.currentUser = user;
        res.status(200).render("auth/user-profile", { user });
      } else {
        // wrong password
        res
          .status(500)
          .render("auth/login", { errorMessage: "Incorrect password." });
      }
    })
    .catch((error) => {
      console.log("Issues logging in ...");
      next(error);
    });
});

//POST /logout
router.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) next(err);
    res.redirect("/");
  });
});

//GET user-profile
router.get("/user-profile", (req, res) => {
  res.render("auth/user-profile", { user: req.session.currentUser });
});

module.exports = router;
