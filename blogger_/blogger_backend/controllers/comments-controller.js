const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Blog = require("../models/blog");
const User = require("../models/user");
const Comment=require("../models/comment");
const Redis = require("redis");
const redisClient =Redis.createClient();
const DEFAULT_EXPIRATION =3600;
redisClient.connect().then().catch((err) => console.log(err))

const getCommentsByBlogId=async (req,res,next)=>{
    const blogId=req.params.bid;
    let comments=await redisClient.get("comments"+blogId);
    if(comments!=null){
        console.log("Cache hit");
        res.json({
            'comments': JSON.parse(comments)
        })
    }
    else {
        console.log("Cache miss");
        try{
            comments = await Comment.find({blogId:blogId}).sort({date: 1}).exec();
        }catch(err){
            return next(new HttpError("Couldn't get the comments from the database", 500));
        }
        if(!comments){
            return next(
                new HttpError("Couldn't find the comments for provided blog Id", 404)
              );
        }
        comments=comments.map(comment=>comment.toObject())
        let add=(comment,threads)=>{
            for(let thread in threads){
                value=threads[thread];
                if(thread.toString()===comment.parentId.toString()){
                    value.children[comment._id]=comment;
                    return;
                }
                if(value.children){
                    add(comment,value.children);
                }
            }
        }
        // console.log(comments) 
        let threads={},comment;
        for(let i=0;i<comments.length;i++){
            comment=comments[i];
            comment['children']={}
            let parentId=comment.parentId
            if(!parentId){
                threads[comment._id]=comment;
                continue;
            }
            add(comment,threads)
        }
        await redisClient.setEx("comments"+blogId,DEFAULT_EXPIRATION,JSON.stringify(threads))
        res.json({
            'comments': threads
        })
    }
}
const insertComment=async (req,res,next)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Provided data is invalid or user have to login to comment,Please check!", 422));
  }
  const tmpComment={};
  tmpComment.content=req.body.content;
  tmpComment.creator=req.body.creator;
  tmpComment.blogId=req.body.blogId;
  tmpComment.parentId=req.body.parentId;
  const createdComment = new Comment(tmpComment);
  try{
    await createdComment.save();
    await redisClient.del("comments"+tmpComment.blogId);
    console.log("comments cache cleared")
    res.status(201).json({ comment: createdComment });
  }
  catch(err){ res.status(500).json({error: err})}
}
const updateComment=async(req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError("Provided data is invalid,Please check!", 422));
    }
    const commentId=req.params.cid;
    let content=req.body.content,comment;
    try{
        comment=await Comment.findById(commentId)
    }catch(err){
        return next(new HttpError("Couldn't find the comment", 500));
    }
    if(!comment){
        return next(
            new HttpError("Couldn't find the comments for provided  Id", 404)
          );
    }
    comment.content=content;
    let blogId=comment.blogId;
    try {
        // there is save() function associated with blog returned using .findById as well
        await comment.save();
        await redisClient.del("comments"+blogId);
        console.log("comments cache cleared")
      } catch (err) {
        return next(
          new HttpError("Couldn't save the updated comment into the database!", 500)
        );
      }
    res.status(200).json({ comment: comment.toObject({ getters: true }) });
}
const deleteComment=async (req,res,next)=>{
    let commentId=req.params.cid;
    let blogId=await Comment.findById(commentId).blogId;
    let del=async (commentId)=>{
        let comments;
        try{
            comments = await Comment.find({parentId:commentId}).sort({date: 1}).exec();
        }catch(err){
            return next(new HttpError("Couldn't get the comments from the database to delete", 500));
        }
        if(!comments){
            return next(
                new HttpError("Couldn't find the comments for provided  Id", 404)
              );
        }
        try{
            await Comment.deleteOne({_id:commentId});
        }catch (err) {
            return next(new HttpError("Couldn't delete the comment!", 500));
        }
        comments=comments.map(comment=>{
            comment.toObject();
            del(comment._id);
        });
    }
    del(commentId);
    redisClient.del("comments"+blogId);
    console.log("comments cache cleared");
    res.status(200).json({ message: "Deleted" });
}

const deleteCommentByBlogId=async (req,res,next)=>{
    const blogId=req.params.bid;
    let comments;
    try{
        await Comment.deleteMany({blogId:blogId});
    }catch(err){
        return next(new HttpError("Couldn't find the comments from the database", 500));
    }
    redisClient.del("comments"+blogId);
    console.log("comments cache cleared");
    res.status(200).json({ message: "Deleted" });
}

exports.getCommentsByBlogId=getCommentsByBlogId;
exports.insertComment=insertComment;
exports.updateComment=updateComment;
exports.deleteComment=deleteComment;
exports.deleteCommentByBlogId=deleteCommentByBlogId;