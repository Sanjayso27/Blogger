const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: {type: String,required:true},
  image: { type: String, required: true },
  likeCount: [{ type: mongoose.Types.ObjectId ,required:true,ref:'User'}],
  date: {type: String,required:true},
  // establish connection between user and place schema ref:model name
  creator: { type: mongoose.Types.ObjectId ,required:true,ref:'User'},
});

module.exports = mongoose.model("Blog", blogSchema);
