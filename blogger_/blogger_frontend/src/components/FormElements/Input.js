import React, { useReducer, useEffect } from "react";
import { validate } from "../../util/validators";
import "./Input.css";

// when we have connected/complex states we can use useReducer
const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE": {
      // here value and isValid values overwrite what is originally present in state
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    }
    case "TOUCH": {
      return {
        ...state,
        isTouched: true,
      };
    }
    default:
      return state;
  }
};

const Input = (props) => {
  // reducer is a function which recieves an action (which we can dispatch),we only dispatch action
  // and also recieves the current state and update the state based on the action it recieve and return the new updated state
  // useReducer will take that new state and give it back to the component and rerender everything
  // useReducer takes an optional second arg the initial state that you want to setup
  // dispatch is a function
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isValid: props.initialValid || false,
    isTouched: false,
  });

  // this can create infinte loops,call leads to new props
  // execute too often even when touch state change
  // hence use relevant dependencies using object destructuring
  // useEffect(()=>{
  //   props.onInput(props.id,inputState.value,inputState.isValid);
  // },[props,inputState]);

  const { id, onInput } = props;
  const { value, isValid } = inputState; // here ,only the key corresponding to the passed object is binded
  useEffect(() => {
    props.onInput(id, value, isValid);
  }, [id, value, isValid, onInput]);

  // this function will be called on every keystroke
  // we have to change the  input and validate it
  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,
      validators: props.validators,
    });
  };

  // onBlur triggered when the element has lost focus from the user,that is when user has clicked and unclicked it
  const touchHandler = () => {
    dispatch({
      type: "TOUCH",
    });
  };

  const element =
    // here we create a self closing input and textarea
    // we can write jsx inside braces
    // all jsx must be wrapped under a single root react fragment holds everywhere even outside the return part
    props.element === "input" ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    ) : (
      // 2 way binding for updating the value
      // we give the value as prop in self closing element
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
      />
    );
  return (
    <div
      className={`form-control ${
        !inputState.isValid && inputState.isTouched && "form-control--invalid"
      }`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
