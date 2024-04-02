import React, { ChangeEvent, useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';


const CommentSection = ({commentContent, setCommentContent, setShowCommentSection}:{commentContent: string, setCommentContent:React.Dispatch<React.SetStateAction<string>>, setShowCommentSection:React.Dispatch<React.SetStateAction<boolean>>}) => {
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
        <div className="comment_section active">
            <div className="comment_section_navigation_container">
                <div className="comment_title_container">
                    <div className="comment_tilte">Comment</div>
                </div>
                <div className="comment_close_container">
                    <button className="comment_button" onClick={()=>setShowCommentSection(false)}>
                        <CloseIcon className="comment_button_icon" />
                    </button>
                </div>
            </div>
            <div className="comment_content_container">

                {loading?
                <div>loading</div>:
                <div className="comment_field_container">
                    <textarea id = 'comment_field' className="comment_field" value={commentContent} onChange={handleCommentInput}></textarea>
                </div>
                }
            </div>
        </div>
    )
}

export default CommentSection