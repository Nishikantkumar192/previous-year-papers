const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../model/user.js");
const ExpressError = require("../utils/ExpressError.js");
const transporter = require("../config/nodemailer.js");
const { body, validationResult } = require("express-validator");
const { redirectUrl, isLoggedIn } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

router.get("/login", (req, res) => {
  res.render("user/login.ejs");
});

router.post(
  "/login",
  redirectUrl,
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect(res.locals.redirectUrl);
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
        return next(
          new ExpressError(
            409,
            "Email already exists. Registration is not allowed with the same email.",
          ),
        );
      }
      newUser = new User({ username, email });
      const registeredUser = await User.register(newUser, password);
      req.login(registeredUser, (err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/results");
      });
  },
));
router.get("/forget", (req, res) => {
  res.render("user/passwordReset.ejs");
});

router.post("/forget", wrapAsync(async (req, res,next) => {
  const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ExpressError(400,"Invalid Email"));
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 5 * 60 * 1000;
    const emailSend = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Reset Password OTP",
      text: `Your OTP for resetting your password is: ${otp} .This OTP is valid for 5 minutes. Do not share it with anyone.`,
    };
    await user.save();
    await transporter.sendMail(emailSend);
    res.render("user/OtpVerification");
}));

router.post("/otp-verification", wrapAsync(async (req, res) => {
  const { email, otp, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      //todo: message by flash
      return res.redirect("/otp-verification");
    }
    if (user.resetOtp === "" || otp != user.resetOtp) {
      //todo: message by flash
      return res.redirect("/otp-verification");
    }
    if (user.resetOtpExpireAt < Date.now()) {
      //todo: message by flash
      return res.redirect("/otp-verification");
    }
    await user.setPassword(password);
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();
    res.render("user/login.ejs");
}));
router.get("/logout", isLoggedIn, (req, res) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    res.redirect("/results");
  });
});

module.exports = router;
