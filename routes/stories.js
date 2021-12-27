const express = require("express");
const router = express.Router();
const { isLogged, isGuest } = require("./../middleware/auth");
const Story = require("./../models/Story");
const User = require("./../models/User");

// @desc:  view public stories
//@route: GET /stories
router.get("/", isLogged, async (req, res) => {
  try {
    const stories = await Story.find({ status: "Public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();

    // populate to use data from user model in this story model
    // since stpory model doesnt have username etc deets
    res.render("stories/index", {
      stories,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/errors/501");
  }
});

// @desc: to add a new story when user clicks create btn
// @route: POST /stories
router.post("/", isLogged, async (req, res) => {
  // to use req.body have to add body parser
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.error(error);
    res.render("error/501");
  }
});

// @desc: to add a new story when user clicks create btn
// @route: GET /stories/add
router.get("/add", isLogged, (req, res) => {
  try {
    res.render("stories/add");
  } catch (err) {
    res.render("errors/501");
  }
});

// @desc: to edit story when user clicks create btn
// @route: GET /stories/edit/:id
router.get("/edit/:id", isLogged, async (req, res) => {
  try {
    const story = await Story.findOne({ _id: req.params.id }).lean();

    // dont forget .lean()

    if (!story) {
      return res.render("errors/404");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      res.render("stories/edit", {
        story,
      });
    }
  } catch (e) {
    console.error(e);
    res.render("errors/404");
  }
});

// @desc: update story
// @route: PUT /stories/:id
router.put("/:id", async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render("erros/404");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        // if does not exist create new
        runValidators: true,
      });
      res.redirect("/dashboard");
    }
  } catch (e) {
    console.error(e);
    res.render("erros/404");
  }
});

// @desc: delete storiee
// @route: DELETE /stories/id

router.delete("/:id", async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    res.render("errors/501");
    console.error(error);
  }
});

// @route: GET /stories/id
//@desc : show particular story
router.get("/:id", async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate("user").lean();
    if (!story) {
      return res.render("errors/404");
    } else {
      res.render("stories/story", {
        story,
      });
    }
  } catch (error) {
    console.error(error);
    res.render("error/404");
  }
});

// @desc: indi user stories
// @route: /stories/user/:userid
router.get("/user/:id", async (req, res) => {
  try {
    const stories = await Story.find({ user: req.params.id, status: "Public" })
      .populate("user")
      .lean();
    res.render("stories/index", {
      stories,
    });
  } catch (error) {
    console.log(error);
    res.render("error/404");
  }
});

module.exports = router;
