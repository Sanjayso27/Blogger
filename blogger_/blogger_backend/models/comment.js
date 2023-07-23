const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: {type: String,required:true},
    date: {type: String,default:Date.now},
    // establish connection between user and comment schema ref:model name
    creator: { type: mongoose.Types.ObjectId ,required:true,ref:'User'},
    blogId: {type: mongoose.Types.ObjectId,required:true,ref:'Blog'},
    parentId: {type: mongoose.Types.ObjectId}
  });
  
  module.exports = mongoose.model("Comment", commentSchema);