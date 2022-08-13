import React,{useContext} from "react";
import { useParams } from "react-router-dom";
import Card from "../UIElements/Card";
import BlogItem from "./BlogItem";
import Button from "../FormElements/Button";
import "./BlogList.css";
import { AuthContext } from "../../context/auth-context";

const BlogList = (props) => {
  const auth = useContext(AuthContext);
  const userId = useParams().userId;
  if (props.items.length === 0) {
    return (
      <div className="center blog-list">
        <Card>
          <h2>No blogs found! {userId === auth.userId && "Create One?"}</h2>
          {userId === auth.userId && <Button to="/blogs/new">New Blog</Button>}
        </Card>
      </div>
    );
  }
  return (
    <ul className="blog-list">
      {props.items.map((blog) => (
        <BlogItem
          key={blog.id}
          id={blog.id}
          image={blog.image}
          title={blog.title}
          description = {blog.description}
          content={blog.content}
          creator={blog.creator}
          onDelete = {props.onDeleteBlog}
        />
      ))}
    </ul>
  );
};

export default BlogList;
