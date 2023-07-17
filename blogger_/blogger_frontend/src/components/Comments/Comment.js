import React from 'react'
import {useState,useRef,useEffect} from "react"
import {ReactComponent as DownArrow} from "../../assets/down-arrow.svg"
import {ReactComponent as UpArrow} from "../../assets/up-arrow.svg"
import { Action } from './Action'
const Comment = ({comment}) => {
  const [input,setInput]=useState("");
  const [editMode,setEditMode]=useState(false);
  const [showInput,setShowInput]=useState(false);
  const onAddComment=()=>{}
  return (
    <div>
        <div className={comment.id === 1 ? "inputContainer":"commentContainer"}>
           {comment.id==1? ( 
           <>
           <input
            type='text'
            className='inputContainer__input first_input'
            autoFocus
            placeholder='type..'
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            />
            <Action className="reply comment" type="COMMENT" handleClick={onAddComment}/>
            </>)
           :
           (
            <>
            <span style={{wordWrap: "break-word"}}>{comment.name}</span>
            <div style={{display: "flex",marginTop: "5px"}}>
                {editMode?(
                    <>
                        <Action className="reply" type="SAVE"/>                    
                        <Action className="reply" type="CANCEL" handleClick={()=>setEditMode(false)}/>                    
                    </>):
                    <>
                    <Action className="reply" type="REPLY"/>
                    <Action className="reply" type="EDIT" handleClick={()=>setEditMode(true)}/>
                    <Action className="reply" type="DELETE"/>
                    </>
                }
            </div>
            </>
           )}
        </div>
        <div style={{paddingLeft: 25}}>
        {comment?.items?.map((cmnt)=>{
            return <Comment key={cmnt.id} comment={cmnt}/>
        })}
        </div>
    </div>
  )
}

export default Comment