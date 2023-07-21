export const useComment=()=>{
    const insertComment=async(blogId,commentId,comment,sendRequest)=>{
        try {
            await sendRequest(
            "http://localhost:5000/api/comments",
            "POST",
            JSON.stringify({
                blogId,
                commentId,
                comment
            })
          );
        }catch (err) {}
    }
    const editComment=async (blogId,commentId,comment,sendRequest)=>{
        try {
            await sendRequest(
            `http://localhost:5000/api/comments/${commentId}`,
            "PATCH",
            JSON.stringify({
                blogId,
                commentId,
                comment
            }),
            {
            "Content-Type":"application/json"
            }
          );
        }catch (err) {}
    }
    const deleteComment=async(blogId,commentId,sendRequest)=>{
        try{
            await sendRequest(
                `http://localhost:5000/api/comments/${commentId}`,
                "DELETE"
            );
        }catch(err){}
    }
    return {insertComment,editComment,deleteComment};
}