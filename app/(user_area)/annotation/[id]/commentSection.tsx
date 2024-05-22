import React, { ChangeEvent, useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import BasicBox from "@/app/(components)/basicBox";


const CommentSection = ({commentContent, setCommentContent}:{commentContent: string, setCommentContent:React.Dispatch<React.SetStateAction<string>>}) => {
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        if (true) {
            setLoading(false)
        }
    },[])

    const handleCommentInput = (e:ChangeEvent<HTMLTextAreaElement>) => {
        setCommentContent(e.target.value)
    }

    return(
        <BasicBox title="Comment" classNames="comment_section" shortcut="C">
                <div className="comment_field_container">
                    <textarea id="comment_field" value={commentContent} onChange={handleCommentInput}></textarea>
                </div>
        </BasicBox>
    )
}

export default CommentSection