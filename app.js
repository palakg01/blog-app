const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const methodOverride = require("method-override");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
const bodyParser = require("body-parser");

dotenv.config({ path: "./config/config.env" });

connectDB();

require("./config/passport")(passport);

const app = express();
const PORT = process.env.PORT || 3000;

// logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// handlebars helper
const {
  formatDate,
  truncateStr,
  stripTags,
  editIcon,
} = require("./helpers/hbs");

// handlebars
app.engine(
  ".hbs",
  engine({
    helpers: {
      formatDate,
      truncateStr,
      stripTags,
      editIcon,
    },
    extname: ".hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", ".hbs");
app.set("views", "./views");

// sessions
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      mongooseConnection: mongoose.connection,
    }),
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});

// body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it (replace post w put or delete)
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// static
app.use(express.static(path.join(__dirname, "public")));

// routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
