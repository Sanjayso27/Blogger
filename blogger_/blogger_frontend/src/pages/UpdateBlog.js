import React, { useEffect, useState,useContext } from "react";
import { useParams ,useNavigate} from "react-router-dom";
import Input from "../components/FormElements/Input";
import Button from "../components/FormElements/Button";
import Card from "../components/UIElements/Card";
import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../util/validators";
import "./BlogForm.css";
import { useForm } from "../hooks/form-hook";
import { useHttpClient } from "../hooks/http-hook";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import ErrorModal from "../components/UIElements/ErrorModal";
import { AuthContext } from "../context/auth-context";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const UpdateBlog = (props) => {
  // since we used blogId in the dynamic segment in the route
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const blogId = useParams().blogId;
  const [loadedBlog, setLoadedBlog] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  //   hooks can only be directly used inside function component (not inside function,if ,for,then blocks)
  const [formState, inputHandler, setFormData] = useForm(
    {
      Title: {
        value: "",
        isValid: false,
      },
      Description: {
        value: "",
        isValid: false,
      },
      Content: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  // you should add anything that is created outside the useEffect as a dependency to useEffect.
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/blogs/${blogId}`
        );
        setLoadedBlog(responseData.blog);
        setFormData(
          {
            Title: {
              value: responseData.blog.title,
              isValid: true,
            },
            Description: {
              value: responseData.blog.description,
              isValid: true,
            },
            Content: {
              value: responseData.blog.content,
              isValid: true,
            },
          },
          true
        );
      } catch (err) {}
    };
    fetchBlog();
  }, [sendRequest, blogId, setFormData]);

  //if we don't use useEffect here,this will cause infinte loop,everytime component rerenders useForm is called ,action is dispatched this cause updating the state in form reducer eventhough the value is same(still new state),which causes this component to rerender again.

  const blogUpdateSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      const yyyy = today.getFullYear();

      const date = dd + "/" + mm + "/" + yyyy;
      await sendRequest(`http://localhost:5000/api/blogs/${blogId}`,"PATCH",JSON.stringify({
        title: formState.inputs.Title.value,
        description:formState.inputs.Description.value,
        content:formState.inputs.Content.value,
        date,
      }),{
        "Content-Type":"application/json",
        Authorization: "Bearer "+ auth.token
      })
      navigate(`/${auth.userId}/blogs`);
    }catch(err){}
  };
  if (!loadedBlog && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Couldn't find a blog</h2>
        </Card>
      </div>
    );
  }
  if (isLoading) {
    return (
      // index.css syling applies here as well
      <div className="center">
        <LoadingSpinner asOverlay />
      </div>
    );
  }
  return (
    <>
    <ErrorModal error={error} onClear={clearError}/>
      {!isLoading && loadedBlog && <form className="blog-form" onSubmit={blogUpdateSubmitHandler}>
        {/* we should be able to work with initial value and validity*/}
        <Input
          id="Title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title"
          onInput={inputHandler}
          initialValue={loadedBlog.title}
          initialValid={true}
        />
        <Input
          id="Description"
          element="textarea"
          label="Description"
          rows={3}
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description(min 5 characters)"
          onInput={inputHandler}
          initialValue={loadedBlog.description}
          initialValid={true}
        />
        {/* <Input
          id="Content"
          element="textarea"
          label="Content"
          rows={10}
          validators={[VALIDATOR_MINLENGTH(20)]}
          errorText="Please enter a valid content(min 20 characters)"
          onInput={inputHandler}
          initialValue={loadedBlog.content}
          initialValid={true}
        /> */}
        <div className="ckeditor">
        <label htmlFor={"Content"}>{"Content"}</label>
        <CKEditor
            editor={ ClassicEditor }
            data={loadedBlog.content}
            // onReady={ editor => {
            //     // You can store the "editor" and use when it is needed.
            //     console.log( 'Editor is ready to use!', editor );
            // } }
            onChange={ ( event, editor ) => {
                const data = editor.getData();
                inputHandler("Content",data,true)
            } }
        />
        </div>
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE BLOG
        </Button>
      </form>}
    </>
  );
};

export default UpdateBlog;
