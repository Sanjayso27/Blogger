import { useNavigate } from "react-router-dom";

export const useComment=()=>{
    const navigate = useNavigate();
    const insertComment=async(blogId,parentId,content,creator,sendRequest)=>{
        try {
            await sendRequest(
            "http://localhost:5000/api/comments",
            "POST",
            JSON.stringify({
                content:content,
                creator:creator,
                blogId:blogId,
                parentId:parentId
            }),
            {
            "Content-Type":"application/json"
            }
          );
          navigate(`/blogs`);
        }catch (err) {}
    }
    const editComment=async (blogId,commentId,content,sendRequest)=>{
        try {
            await sendRequest(
            `http://localhost:5000/api/comments/${commentId}`,
            "PATCH",
            JSON.stringify({
                content
            }),
            {
            "Content-Type":"application/json"
            }
          );
          navigate(`/blogs`);
        }catch (err) {}
    }
    const deleteComment=async(blogId,commentId,sendRequest)=>{
        try{
            await sendRequest(
                `http://localhost:5000/api/comments/${commentId}`,
                "DELETE"
            );
            navigate(`/blogs`);
        }catch(err){}
    }
    return {insertComment,editComment,deleteComment};
}