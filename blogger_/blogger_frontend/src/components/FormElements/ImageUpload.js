import React, { useRef, useState, useEffect } from "react";
import Button from "./Button";
import "./ImageUpload.css";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const filePickerRef = useRef();
//   whenever file changes we have to execute the function inside the useEffect()
  useEffect(() => {
    if(!file){
        return;
    }
    // is added into browser,fileReader helps to convert a binary data to imageUrl doesn't give a promise or callback
    const fileReader = new FileReader();
    // when fileReader API loads a new file,or done parsing/reading a file
    fileReader.onload=()=>{
        setPreviewUrl(fileReader.result);
    }
    fileReader.readAsDataURL(file)
  }, [file]);
  const pickedHandler = (event) => {
    // we have files property for event associated with default input with file type
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  return (
    <div className="form-control">
      {/* we enclose style object in a curly brace in which we write style as key-value pairs  */}
      <input
        type="file"
        id={props.id}
        style={{ display: "none" }}
        accept=".jpg,.jpeg,.png"
        ref={filePickerRef}
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
