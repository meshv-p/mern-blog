const express = require("express");
const router = express.Router();

const {
  getAllBlogs,
  createblog,
  getOneBlog,
  deleteBlog,
  findBlog,
  updateBlog,
} = require("../controllers/blog");
const { fetchUser, checkBlogOwner } = require("../middleware/fetchUser");

router.route("/search/").get(findBlog);
// router.use([fetchUser]);
router.get("/blogs", getAllBlogs);
router.post("/blogs", fetchUser, createblog);
// router.route("/blogs").get(getAllBlogs).post(createblog);
// router.route('/:id').get(getTask).patch(updateTask).delete(deleteTask)
router.route("/blog/:_id").get(getOneBlog);
router.use([fetchUser, checkBlogOwner]);
router.route("/blog/:_id").delete(deleteBlog).patch(updateBlog);
// router.route
module.exports = router;
