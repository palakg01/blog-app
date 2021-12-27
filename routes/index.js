const express = require("express");
const router = express.Router();
const { isLogged, isGuest } = require("./../middleware/auth");
const Story = require("./../models/Story");
const User = require("./../models/User");

router.get("/", isGuest, (req, res) => {
  res.render("loginView", {
    layout: "login",
  });
});

router.get("/dashboard", isLogged, async (req, res) => {
  // console.log(req);
  try {
    var stories = await Story.find({ user: req.user.id }).lean();
    console.log(req.user.id);
    console.log(stories);
    res.render("dashboardView", {
      name: req.user.firstName,
      stories,
    });
  } catch (error) {
    res.render("error/501");
    console.error(error);
  }
});

module.exports = router;
