var express = require("express");
var passport = require("../config/passport");
var router = express.Router();
var db = require("../models");
  // Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
  var bcrypt = require("bcryptjs");

router.get("/", function (req, res) {
  // console.log("This is babyName function: " + babyName);
  // console.log("This is user function: " + user);
  // res.render("index", { name: "hey" });
  res.render("index", { layout: "singular.handlebars" });
});

router.post("/api/login", passport.authenticate("local"), function(req, res) {
  res.json(req.user);
});

router.get("/login", function (req, res) {
  res.render("login", { layout: "singular.handlebars" });
});
router.get("/signup", function (req, res) {
  res.render("signup", { layout: "singular.handlebars" });
});

router.post("/search", function (req, res) {
  var genderChoice = req.body.gender;
  var ethnicityChoice = req.body.ethnicity;
  var startingLetter = req.body.startingLetter;
  var resultNum = parseInt(req.body.resultNum);
  console.log(startingLetter);

  db.BabyName.findAll({
    where: {
      sex: genderChoice,
      ethnicity: ethnicityChoice,
      name: { [db.Sequelize.Op.like]: startingLetter + "%"}
    },
    limit: resultNum
  }).then(function (results) {
    // res.json(results);
    res.render("names", { objNames: results });
    // console.log(results[2]._previousDataValues);
    for (var index = 0; index < 10; index++) {
      console.log(results[index].name);
    }
  });
});

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  router.post("/api/userdata", function(req, res) {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, "/api/login");
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  router.get("/api/userdata", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  // ========================================================================
// Creating our User model
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    // The email cannot be null, and must be a proper email before creation
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    // The password cannot be null
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };
  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.addHook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });
  return User;
};
  // ========================================================================

// router.put("/api/burgers/:id", function (req, res) {
//   var condition = "id = " + req.params.id;
//   var dev = "devoured = " + req.body.devoured;

//   console.log("condition", condition);

//   burger.update(dev, condition, function (result) {
//     if (result.changedRows === 0) {
//       // If no rows were changed, then the ID must not exist, so 404
//       return res.status(404).end();
//     } else {
//       res.status(200).end();
//     }
//   });
// });

// router.delete("/api/burgers/:id", function (req, res) {
//   var condition = "id = " + req.params.id;

//   burger.delete(condition, function (result) {
//     if (result.affectedRows === 0) {
//       // If no rows were changed, then the ID must not exist, so 404
//       return res.status(404).end();
//     } else {
//       res.status(200).end();
//     }
//   });
// });

module.exports = router;
