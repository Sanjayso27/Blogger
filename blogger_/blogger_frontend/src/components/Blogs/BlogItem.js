import React, { useState, useContext } from "react";

import Card from "../UIElements/Card";
import Button from "../FormElements/Button";
import Modal from "../UIElements/Modal";
import LoadingSpinner from "../UIElements/LoadingSpinner";
import ErrorModal from "../UIElements/ErrorModal";
import { AuthContext } from "../../context/auth-context";
import { useHttpClient } from "../../hooks/http-hook";
import { Link, useNavigate } from "react-router-dom";
import "./BlogItem.css";

const BlogItem = (props) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showDeleteWarningHandler = () => setShowConfirmModal(true);

  const cancelDeleteHandler = () => setShowConfirmModal(false);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
  const navigate=useNavigate();
  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL+`/blogs/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer "+ auth.token
        }
      );
      await sendRequest(
        process.env.REACT_APP_BACKEND_URL+`/comments/all/${props.id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer "+ auth.token
        }
      );
      navigate("/")
    } catch (err) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="blog-item__modal-actions"
        footer={
          <>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </>
        }
      >
        <p>
          Do you want to proceed and delete this blog?This can't be undone later
        </p>
      </Modal>
      <li className="blog-item">
        <Card className="blog-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="blog-item__link">
            <Link to={`/blogs/ind/${props.id}`}>
              <div className="blog-item__image">
                <img src={process.env.REACT_APP_ASSEST_URL+`/${props.image}`} alt={props.title} />
              </div>
            </Link>
          </div>
          <div className="blog-item__info">
            <h2>{props.title}</h2>
            <p>{props.description}</p>
          </div>
          <div className="blog-item__actions">
            {/* you have to slashes as separtors properly  */}
            {auth.userId === props.creator && (
              <>
                <Button to={`/blogs/update/${props.id}`}>EDIT</Button>
                <Button danger onClick={showDeleteWarningHandler}>
                  DELETE
                </Button>
              </>
            )}
          </div>
        </Card>
      </li>
    </>
  );
};

export default BlogItem;
