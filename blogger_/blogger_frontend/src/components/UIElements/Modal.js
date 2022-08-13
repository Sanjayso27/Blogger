import React from "react";
import reactDom from "react-dom";

import Backdrop from "./Backdrop";
import { CSSTransition } from "react-transition-group";
import "./Modal.css";

const ModalOverlay = (props) => {
  const content = (
    //   more flexibility for the classes
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
      <h2>{props.header}</h2>
      </header>
      <form
        // if we render any button inside the form ,we don't accidentally reload the page by triggering the form submission
        // if we provide our own onSUbmit function it's onSubmit function duty to take care of that
        onSubmit={props.onSubmit ? props.onSubmit : (e) => e.preventDefault()}
      >
        {/* separate content and footer to apply different styles to those(inputs and submit buttons)*/}
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );
  return reactDom.createPortal(content, document.getElementById("modal-hook"));
};

// modal = overlay + backdrop + animation
// hence overlay and modal are different components

const Modal = (props) => {
  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel} />}
      {/* think of CSSTranasition in case of animation */}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        {/* spread operator which takes all the key value pair of props object and pass it down*/}
        <ModalOverlay {...props} />
      </CSSTransition>
    </>
  );
};

export default Modal;
