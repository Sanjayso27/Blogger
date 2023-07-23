const express= require("express");
const { check } = require("express-validator");

const router = express.Router();

const {
    getCommentsByBlogId,
    insertComment,
    updateComment,
    deleteComment
}=require("../controllers/comments-controller")

router.get("/:bid", getCommentsByBlogId);
router.post(
    "/",
    [
      check("content").not().isEmpty()
    ],
    insertComment
);
router.patch(
    "/:cid",
    [
        check("content").not().isEmpty()
    ],
    updateComment
)
router.delete(
    "/:cid",deleteComment
)

module.exports=router;