import React, { useEffect, useState } from "react";

import ErrorModal from "../components/UIElements/ErrorModal";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import BlogList from "../components/Blogs/BlogList.js";
import { useHttpClient } from "../hooks/http-hook";

const Blogs = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedBlogs, setLoadedBlogs] = useState();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const responseData= await sendRequest(process.env.REACT_APP_BACKEND_URL+"/blogs/");
        setLoadedBlogs(responseData.blogs);
      } catch (err) {}
    };
    fetchBlogs();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedBlogs && <BlogList items={loadedBlogs} />}
    </>
  );
};

export default Blogs;
