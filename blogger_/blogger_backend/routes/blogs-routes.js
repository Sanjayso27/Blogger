const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file-upload")
const checkAuth=require("../middleware/check-auth");
const {
  getBlogs,
  getBlogById,
  getBlogsByUserId,
  createBlog,
  updateBlog,
  deleteBlog,
  getLikedUsers,
  updateLikedUsers,
} = require("../controllers/blogs-controller");

const router = express.Router();

router.get("/", getBlogs);

router.get("/:bid", getBlogById);
router.get("/:bid/likedUsers", getLikedUsers);
router.get("/user/:uid", getBlogsByUserId);

router.use(checkAuth);

router.patch("/:bid/likedUsers", updateLikedUsers);


// we can also add multiple middlewares which gets executed from left-right.
// check takes the property in our request body which need to be validated and the whole chain returns a middleware
// we have to register the middleware and you have to go to the controller and use Validation result in the middlewares where validation is present
router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("content").isLength({ min: 20 }),
    check("date").not().isEmpty()
  ],
  createBlog
);

router.patch(
  "/:bid",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("content").isLength({ min: 20 }),
    check("date").not().isEmpty()
  ],
  updateBlog
);

router.delete("/:bid", deleteBlog);

module.exports = router;
