import React from "react";

import UserItem from "./UserItem";
import Card from "../UIElements/Card";
import "./UserList.css";

const UserList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>Users not found!</h2>
        </Card>
      </div>
    );
  }
  return (
    <ul className="users-list">
      {props.items.map((user) => (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          Email={user.Email}
          blogCount={user.blogs.length}
        />
      ))}
    </ul>
  );
};

export default UserList;
