const { default: mongoose } = require("mongoose");
const blog = require("../models/blog");
const { User } = require("../models/user");
// var jwt = require("jsonwebtoken");

const getAllBlogs = async (req, res) => {
  // let { pgNo, pgSize } = req.params;
  // console.log(pgNo);
  let page = 1;
  let limit = 4;
  try {
    let allBlogs = await blog.aggregate([
      {
        $lookup: {
          from: "profiles",
          localField: "user",
          foreignField: "user",
          as: "user",
        },
      },
      // {
      //   $skip: (page - 1) * limit,
      // },
      // {
      //   $limit: limit,
      // },
    ]);
    let length = await blog.countDocuments({});

    res.json({ allBlogs, length });
  } catch (error) {
    res.json({ error });
  }
};

const createblog = async (req, res) => {
  try {
    let body = req.body;

    // Logged in user data from headers
    let data = req.user;
    // console.log(body);
    let newBlog = new blog({ ...body, user: data.id });
    await newBlog.save();

    try {
      let author = await User.findById({ _id: newBlog.user });
      author.posts.push(newBlog);
      await author.save();
    } catch (error) {
      // User doen't exists
      console.log("42", error);
      res.json({
        message: "Some error occured",
      });
    }
    return res.send({ newBlog });
  } catch (error) {
    console.log(error);
  }
};

const getOneBlog = async (req, res) => {
  /**
   * Find the blog by the id OR title OR tag
   */

  let { _id } = req.params;
  // console.log(typeof _id);
  try {
    try {
      let findBlog = await blog.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(_id),
          },
        },
        {
          $lookup: {
            from: "profiles",
            localField: "user",
            foreignField: "user",
            as: "user",
          },
        },
      ]);
      if (findBlog == null)
        return res.json({
          message: "Blog not found...",
        });
      res.json({ findBlog });
      // console.log(profile);
      // return res.json({ profile });
    } catch (error) {
      console.log("errror", error);
    }

    // let findBlog = await blog.findById(_id);
    // console.log(findBlog);
  } catch (error) {
    res.json({ error });
  }
};

const deleteBlog = async (req, res) => {
  let { _id } = req.params;
  try {
    let deleteBlog = await blog.findByIdAndDelete(_id);
    if (deleteBlog == null)
      return res.json({
        message: "Blog not found...",
      });
    // console.log(deleteBlog);
    res.json({ deleteBlog });
  } catch (error) {
    // res.json({ error });
    console.log(error);
  }
};

const findBlog = async (req, res) => {
  /**
   * Find the blog by title OR tag
   */
  let { search } = req.query;
  console.log(search);
  try {
    let result = await blog.aggregate([
      {
        $search: {
          index: "title",
          text: {
            query: search,
            path: {
              wildcard: "*",
            },
          },
        },
      },
    ]);
    if (result.length == 0)
      return res.json({
        message: "No result found",
      });
    console.log(result);
    res.json({ result });
  } catch (error) {
    return res.json({
      message: "No result found",
    });
  }
};

const updateBlog = async (req, res) => {
  let body = req.body;
  let { _id } = req.params;
  console.log(_id);
  try {
    let b = await blog.findById(_id);
    console.log(b);
    let updatedBlog = await blog.findOneAndUpdate(_id, body, { new: true });
    // console.log(updatedBlog);

    res.json({ updatedBlog });
  } catch (error) {
    res.json({ error });
    console.log(error);
  }
};

module.exports = {
  getAllBlogs,
  createblog,
  getOneBlog,
  deleteBlog,
  findBlog,
  updateBlog,
};
