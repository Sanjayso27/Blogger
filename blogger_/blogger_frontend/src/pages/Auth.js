import React, { useState, useContext } from "react";
import { useForm } from "../hooks/form-hook";
import { useHttpClient } from "../hooks/http-hook";
import Input from "../components/FormElements/Input";
import Button from "../components/FormElements/Button";
import { AuthContext } from "../context/auth-context";
import ImageUpload from "../components/FormElements/ImageUpload";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../util/validators";
import Card from "../components/UIElements/Card";
import ErrorModal from "../components/UIElements/ErrorModal";
import LoadingSpinner from "../components/UIElements/LoadingSpinner";
import "./Auth.css";

const Auth = (props) => {
  const auth = useContext(AuthContext);
  const [isLogInMode, setIsLogInMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      Email: {
        value: "",
        isValid: false,
      },
      Password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    // if there is group of state updates inside a synchronous code block then react will update the state together and only rerender the component once
    if (!isLogInMode) {
      setFormData(
        { ...formState.inputs, Name: undefined, image: undefined },
        formState.inputs.Email.isValid && formState.inputs.Password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          Name: { value: "", isValid: false },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    // useState hook might batch multiple calls and mayn't update the state immediately
    // hence this function based approach
    setIsLogInMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    // console.log(formState.inputs);
    if (isLogInMode) {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.Email.value,
            password: formState.inputs.Password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(responseData.user.id);
      } catch (err) {}
    } else {
      try {
        // here we have to send both text(anything we can  write) and image data so we use Formdata
        const formData = new FormData();
        formData.append('email',formState.inputs.Email.value)
        formData.append('name',formState.inputs.Name.value)
        formData.append('password',formState.inputs.Password.value)
        formData.append('image',formState.inputs.image.value)
        // fetch api automatically adds the header for the formData
        const responseData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          formData
        );
        auth.login(responseData.user.id);
      } catch (err) {}
    }
  };
  return (
    <>
      {/* // which class is applied here from auth.css or from card.css
    // Here auth.css takes more precedence than card */}
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>{isLogInMode ? "LOGIN" : "SIGNUP"}</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLogInMode && (
            <Input
              id="Name"
              element="input"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter name"
              onInput={inputHandler}
            />
          )}
          {!isLogInMode && (
            <ImageUpload center id="image" onInput={inputHandler} errorText="Please provide an image"/>
          )
          }
          <Input
            id="Email"
            element="input"
            type="email"
            label="Email"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email"
            onInput={inputHandler}
          />
          <Input
            id="Password"
            element="input"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password(atleast 6 characters)"
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLogInMode ? "LOGIN" : "SIGNUP"}
          </Button>
          {/* for most browsers default type is submit */}
          <Button onClick={switchModeHandler} type="button" inverse>
            SWITCH TO {isLogInMode ? "SIGNUP" : "LOGIN"}
          </Button>
        </form>
      </Card>
    </>
  );
};

export default Auth;
