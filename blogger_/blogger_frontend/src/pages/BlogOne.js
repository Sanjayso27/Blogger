import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ErrorModal from "../components/UIElements/ErrorModal";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import { useHttpClient } from "../hooks/http-hook";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AuthContext } from "../context/auth-context";
import {useNode} from "../hooks/useNode";
import { useComment } from "../hooks/useComment";
import "./BlogOne.css";
import Comment from "../components/Comments/Comment";
import "../components/Comments/Comment.css";



const BlogOne = () => {
  const blogId = useParams().blogId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedBlog, setLoadedBlog] = useState();
  const [likeCount, setLikeCount] = useState(0);
  const auth = useContext(AuthContext);
  const [commentsData,setCommentsData]=useState();
  // const {insertNode,editNode,deleteNode}=useNode();
  const {insertComment,editComment,deleteComment}=useComment(null);
  const handleInsertComment=(commentId,comment)=>{
    insertComment(blogId,commentId,comment,auth.userId,sendRequest,auth.token);
  }
  const handleEditComment=(commentId,comment)=>{
    editComment(blogId,commentId,comment,sendRequest,auth.token);
  }
  const handleDeleteComment=(commentId)=>{
    deleteComment(loadedBlog.blogId,commentId,sendRequest,auth.token);
  }
  // const handleInsertNode = (folderId,item)=>{
  //   const finalStructure= insertNode(commentsData,folderId,item);
  //   setCommentsData(finalStructure);
  // }
  // const handleEditNode = (folderId,value)=>{
  //   const finalStructure=editNode(commentsData,folderId,value);
  //   setCommentsData(finalStructure);
  // }
  // const handleDeleteNode=(folderId)=>{
  //   const finalStructure= deleteNode(commentsData,folderId);
  //   const temp={...finalStructure};
  //   setCommentsData(temp);
  // }
  const fetchComment = async ()=>{
  try{
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL+`/comments/${blogId}`
      );
      setCommentsData(Object.values(responseData.comments)[0]);
      console.log(Object.values(responseData.comments));
    } catch(err){}
  }
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL+`/blogs/${blogId}`
        );
        setLoadedBlog(responseData.blog);
      } catch (err) {}
    };
    fetchBlog();
    const fetchLikeCount = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL+`/blogs/${blogId}/likedUsers`
        );
        setLikeCount(responseData.likedUsers.length);
      } catch(err) {}
    }
    fetchLikeCount();
    fetchComment();
  }, [sendRequest]);

  const likeHandler = async (event) => {
    event.preventDefault();
    // .includes() is used to check whether an element is present in the array
    try {
      const responseData = await sendRequest(
        process.env.REACT_APP_BACKEND_URL+`/blogs/${blogId}/likedUsers`
      );
      if (
        auth.userId !== null &&
        !responseData.likedUsers.includes(auth.userId)
      ) {
        try {
          await sendRequest(
            process.env.REACT_APP_BACKEND_URL+`/blogs/${blogId}/likedUsers`,
            "PATCH",
            JSON.stringify({
              userId: auth.userId,
            }),
            {
              "Content-Type": "application/json",
              Authorization: "Bearer "+ auth.token
            }
          );
          setLikeCount((likeCount) => likeCount + 1);
        } catch (err) {}
      }
    } catch (err) {}
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedBlog && (
        <>
          <div
            className="blogOne--wrap"
            style={{ backgroundImage: `url(http://localhost:5000/${loadedBlog.image})` }}
          ></div>
          <div className="blogOne--container">
            <h1 className="blogOne--h1">{loadedBlog.title}</h1>
            <h3 className="blogOne--h3">{loadedBlog.description}</h3>
            <div className="metaData">
              <div>Last Updated: {loadedBlog.date}</div>
              <div className="likeBtn" onClick={likeHandler}>
                <FontAwesomeIcon icon={faThumbsUp} />
                {likeCount}
              </div>
            </div>
          </div>
          <hr />
          {/* <p className="blogOne--p"></p> */}
          <CKEditor
              editor={ ClassicEditor }
              data={loadedBlog.content}
              disabled={true}
          />
          {/* <div contentEditable="true">{loadedBlog.content}</div> */}
          {commentsData &&  <Comment 
          comment={commentsData}
          handleDeleteNode={handleDeleteComment}
          handleEditNode={handleEditComment}
          handleInsertNode={handleInsertComment}
          /> }
        </>
      )}
    </>
  );
};

export default BlogOne;
