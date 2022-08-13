const express = require("express");
const { check } = require("express-validator");
const { login, getUsers, signup } = require("../controllers/users-controller");
const fileUpload  = require("../middleware/file-upload")

const router = express.Router();

router.get("/", getUsers);

router.post(
  "/signup",
  // concrete middleware to get the single file and to extract the image key from incoming request
  fileUpload.single("image"),
  [
    check("name").isLength({ min: 6 }),
    check("email").normalizeEmail().isEmail(), //Test@test.com => test@test.com
    check("password").isLength({ min: 6 }),
  ],
  signup
);

router.post("/login", login);

module.exports = router;
