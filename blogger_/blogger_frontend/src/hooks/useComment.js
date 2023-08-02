import { useNavigate } from "react-router-dom";

export const useComment=()=>{
    const navigate = useNavigate();
    const insertComment=async(blogId,parentId,content,creator,sendRequest,token)=>{
        try {
            await sendRequest(
            process.env.REACT_APP_BACKEND_URL+"/comments",
            "POST",
            JSON.stringify({
                content:content,
                creator:creator,
                blogId:blogId,
                parentId:parentId
            }),
            {
            "Content-Type":"application/json",
            Authorization: "Bearer "+ token
            }
          );
          navigate(`/blogs`);
        }catch (err) {}
    }
    const editComment=async (blogId,commentId,content,sendRequest,token)=>{
        try {
            await sendRequest(
            process.env.REACT_APP_BACKEND_URL+`/comments/${commentId}`,
            "PATCH",
            JSON.stringify({
                content
            }),
            {
            "Content-Type":"application/json",
            Authorization: "Bearer "+ token
            }
          );
          navigate(`/blogs`);
        }catch (err) {}
    }
    const deleteComment=async(blogId,commentId,sendRequest,token)=>{
        try{
            await sendRequest(
                process.env.REACT_APP_BACKEND_URL+`/comments/${commentId}`,
                "DELETE",
                null,
                {
                    Authorization: "Bearer "+ token
                }
            );
            navigate(`/blogs`);
        }catch(err){}
    }
    return {insertComment,editComment,deleteComment};
}