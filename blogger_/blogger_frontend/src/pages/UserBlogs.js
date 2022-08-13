import React, { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import { useHttpClient } from "../hooks/http-hook";
import ErrorModal from "../components/UIElements/ErrorModal";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import BlogList from "../components/Blogs/BlogList";

const UserBlogs = (props) => {
  // useParams return an object which has dynamics segments in route configs as properties
  const userId = useParams().userId;
  // since the component should rerender the loadedBlogs takes a value we should keep it as a state
  const [loadedBlogs, setLoadedBlogs] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  try {
    // useEffect used so that we only send request whenever the page is mounted and not on every rerendering of the component
    useEffect(() => {
      const fetchBlogs = async () => {
        const responseData = await sendRequest(
          `http://localhost:5000/api/blogs/user/${userId}`
        );
        setLoadedBlogs(responseData.blogs);
      };
      fetchBlogs();
    }, [sendRequest]);
  } catch (err) {}

  // to change the UI when the delete take place this is the way when we can change in the parent from the children first define a function in the parent and then pass this function down as a prop
  const blogDeleteHandler = (deletedBlogId) =>{
    setLoadedBlogs(prevBlogs => prevBlogs.filter(blog=>blog.id!==deletedBlogId))
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedBlogs && <BlogList items={loadedBlogs} onDeleteBlog = {blogDeleteHandler}/>}
    </>
  );
};

export default UserBlogs;
