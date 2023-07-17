const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: {type: String,required:true},
    likeCount: [{ type: mongoose.Types.ObjectId ,required:true,ref:'User'}],
    date: {type: String,required:true},
    // establish connection between user and comment schema ref:model name
    creator: { type: mongoose.Types.ObjectId ,required:true,ref:'User'},
    parentBlog: {type: mongoose.Types.ObjectId,required:true,ref:'Blog'},
    childrenComment: [{type: mongoose.Types.ObjectId,required:true,ref:this}],
    parentComment: {type: mongoose.Types.ObjectId,required:true,ref:this}
  });
  
  module.exports = mongoose.model("Comment", commentSchema);