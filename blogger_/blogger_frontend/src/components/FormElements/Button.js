import React from "react";
import { Link } from "react-router-dom";

import "./Button.css";

const Button = (props) => {
  if (props.href) {
    return (
      // button--default is not defined in the css file??
      // don't using href here cause the page to reload??
      <a
        className={`button button--${props.size || "default"} ${
          props.inverse && "button--inverse"
        } ${props.danger && "button--danger"}`}
        href={props.href}
      >
        {/*semicolon inside js expression inside curly braces in jsx gives error*/}
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link
        to={props.to}
        exact={props.exact}
        className={`button button--${props.size || "default"} ${
          props.inverse && "button--inverse"
        } ${props.danger && "button--danger"}`}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
      className={`button button--${props.size || "default"} ${
        props.inverse && "button--inverse"
      } ${props.danger && "button--danger"}`}
      // type=button then button is clickable element,other options are submit and reset
      // type=submit by default submit the form data
      type={props.type}
      onClick={props.onClick}
      // we can disable the button based on the prop
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
