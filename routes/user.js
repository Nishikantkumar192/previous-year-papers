const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../model/user.js");
const ExpressError = require("../utils/ExpressError.js");
const transporter = require("../config/nodemailer.js");
const { body, validationResult } = require("express-validator");
const { isLoggedIn } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Log-in Successfully");
    res.redirect("/results");
  },
);

router.get("/signup", (req, res) => {
  res.render("user/signup");
});

router.post(
  "/signup",
  [
    body("username", "Username must be greater than 5 character").isLength({
      min: 5,
    }),
    body("email", "The formate of Email is Not correct").isEmail(),
    body("password", "Password must be greater than 5 character").isLength({
      min: 5,
    }),
  ],
  wrapAsync(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      const errMsg = error
        .array()
        .map((err) => err.msg)
        .join(",");
      return next(new ExpressError(400, errMsg));
    }
    let { username, email, password } = req.body;
    let newUser = await User.findOne({ email });
    if (newUser) {
      req.flash("error", "User registerd already.Use another Email");
      return res.redirect("/signup");
    }
    newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "you have registered successfully");
      res.redirect("/results");
    });
  }),
);

router.get("/forget-password", (req, res) => {
  res.render("user/passwordReset.ejs");
});

router.post(
  "/forget-password",
  wrapAsync(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      req.status(400).flash("error", "Invalid Email");
      return res.redirect("/forget-password");
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 5 * 60 * 1000;
    await user.save();
    req.session.email = user.email;
    const emailSend = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Reset Password OTP",
      html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #333;">ShopEasy - Password Reset</h2>
        <p>Your OTP code is:</p>
        <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
        <p>This OTP is valid for <b>5 minutes</b>.</p>
        <p>If you did not request this, please ignore this email.</p>
      </div>
    `,
    };
    try {
      await transporter.sendMail(emailSend);
    } catch (err) {
      req.flash("error", "Try again later");
      return res.redirect("/forget-password");
    }
    req.flash("success", "OTP has been sent");
    res.redirect("/otp-verification");
  }),
);

router.get("/otp-verification", (req, res) => {
  res.render("user/OtpVerification");
});

router.post(
  "/otp-verification",
  wrapAsync(async (req, res) => {
    const { otp, password } = req.body;
    const email = req.session.email;
    const user = await User.findOne({ email });
    if (!user) {
      req.flash("error", "Invalid User");
      return res.redirect("/otp-verification");
    }
    if (user.resetOtpExpireAt < Date.now()) {
      req.flash("error", "OTP Expired");
      return res.redirect("/otp-verification");
    }
    if (user.resetOtp === "" || otp !== user.resetOtp) {
      req.flash("error", "Invalid OTP");
      return res.redirect("/otp-verification");
    }
    await user.setPassword(password);
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    req.session.email = null;
    await user.save();
    req.flash("success", "password changed successfully");
    res.redirect("/login");
  }),
);
router.get("/logout", isLoggedIn, (req, res) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", "Logout successfull");
    res.redirect("/results");
  });
});

module.exports = router;
