import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import {AuthContext} from "../../context/auth-context"
import "./NavLink.css";

const NavLinks = () => {
  const auth = useContext(AuthContext);
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/users">Users</NavLink>
      </li>
      <li>
        <NavLink to="/Blogs">Blogs</NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          {/* for every user it's not u1 ??? */}
          <NavLink to={`/${auth.userId}/blogs`}>My Blogs</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/blogs/new">New Blog</NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Login</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>Logout</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
