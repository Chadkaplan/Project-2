var express = require("express");

var router = express.Router();

var babyName = require("../models/babyName");
var user = require("../models/user");

router.get("/", function (req, res) {
  console.log(babyName);
  console.log(user);


  res.render("index", { name: "hey" });
});


// router.post("/api/burgers", function (req, res) {
//   var name = req.body.name;
//   var vals = req.body.devoured;
//   burger.create(name, vals, function (result) {
//     // Send back the ID of the new quote
//     res.json({ id: result.insertId });
//   });
// });

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