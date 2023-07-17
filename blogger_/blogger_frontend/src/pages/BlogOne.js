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
import "./BlogOne.css";
import Comment from "../components/Comments/Comment";
import "../components/Comments/Comment.css";

const comments={
  id: 1,
  items: [
    {
      id: 2,
      name: "hello",
      items: [
        {
          id:3,
          name: "hello world"
          ,items:[
            {
              id:4,
              name: "hello world universe"
            }
          ]
        },{
          id: 5,
          name: "hello moon"
        }
      ]
    }
  ]
};

const BlogOne = () => {
  const blogId = useParams().blogId;
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedBlog, setLoadedBlog] = useState();
  const [likeCount, setLikeCount] = useState(0);
  const [commentsData,setCommentsData]=useState(comments);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/blogs/${blogId}`
        );
        setLoadedBlog(responseData.blog);
      } catch (err) {}
    };
    fetchBlog();
    const fetchLikeCount = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/blogs/${blogId}/likedUsers`
        );
        setLikeCount(responseData.likedUsers.length);
      } catch(err) {}
    }
    fetchLikeCount();
  }, [sendRequest]);

  const likeHandler = async (event) => {
    event.preventDefault();
    // .includes() is used to check whether an element is present in the array
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/blogs/${blogId}/likedUsers`
      );
      if (
        auth.userId !== null &&
        !responseData.likedUsers.includes(auth.userId)
      ) {
        try {
          await sendRequest(
            `http://localhost:5000/api/blogs/${blogId}/likedUsers`,
            "PATCH",
            JSON.stringify({
              userId: auth.userId,
            }),
            {
              "Content-Type": "application/json",
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
          <Comment comment={comments}/>
        </>
      )}
    </>
  );
};

export default BlogOne;
