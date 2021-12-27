const express = require("express");
const router = express.Router();
const passport = require("passport");

// @desc: authentication i.e when user clicks on login
// @route: /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

// @desc: redirecting based on auth
// @route: /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

// @desc: logout btn
// @route: /auth/google
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
