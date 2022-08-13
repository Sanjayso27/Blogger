import { useCallback, useReducer } from "react";

// for in loop can loop through the values in object as well as an array
// no external information from the component is required,it's standalone
const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE": {
      // console.log('Hello');
      let formIsValid = true;
      for (const inputId in state.inputs) {
        // if it's the current updating element update based on the action's isValid o.w from state isValid
        if (!inputId) {
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
        // console.log(inputId, formIsValid);
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          //   how to update an item inside a nested object having key action.inputId
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    }
    case "SET_DATA": {
      return {
        inputs: action.inputs,
        isValid: action.formIsValid,
      };
    }
    default: {
      return state;
    }
  }
};

// we should use use infront of the function name in case of custom hook
// If you use useForm() in your component function, it will get called for every re-evaluation of your component (i.e. for every re-render cycle). Hence all the logic in a custom hook runs every time your component function is executed.
export const useForm = (initialInputs, initialFormValidity) => {
  // we should use the state definition inside the functional component
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity,
  });

  // Here if in the component rerender, the new function is created,which will thus lead to call onInput again
  // and this may cause infinite loop hence we use useCallback
  // Hence this function will be stored away by react and will be reused when the component rerender
  // dependencies are used to specify under what conditions we have to rerender the function
  const InputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      value: value,
      isValid: isValid,
      inputId: id,
    });
  }, []);

  const setFormData = useCallback((inputData, formValidity) => {
    // calling dispatch will definitely lead to updating of the state
    dispatch({
      type: "SET_DATA",
      inputs: inputData,
      formIsValid: formValidity,
    });
  }, []);

  //   can return anything needn't be an array
  // we can call InputHandler and setFormData function which we are exposing here in our other modules
  return [formState, InputHandler, setFormData];
};
