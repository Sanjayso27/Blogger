import React from "react";
import Avatar from "../UIElements/Avatar";
import Card from "../UIElements/Card";
import { Link } from "react-router-dom";
import "./UserItem.css";

const UserItem = (props) => {
  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}/blogs`}>
          <div className="user-item__image">
            <Avatar image={process.env.REACT_APP_ASSEST_URL+`/${props.image}`} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.blogCount} {props.blogCount === 1 ? "blog" : "blogs"}
            </h3>
            <h3>{props.Email}</h3>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
