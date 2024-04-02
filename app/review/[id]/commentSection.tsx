import React, { ChangeEvent, useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';


const CommentSection = ({id, activeId, commentContent,}:{id:any, activeId:any, commentContent: string}) => {
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        if (true) {
            setLoading(false)
        }
    },[])
    useEffect(()=>{
        if (activeId === id) {
            document.getElementById(id)?.classList.add('active')
        }
    },[activeId, id])

    return(
        <div id={id} className="comment_section active">
            <div className="comment_section_navigation_container">
                <div className="comment_title_container">
                    <div className="comment_tilte">Comment</div>
                </div>
            </div>
            <div className="comment_content_container">

                {loading?
                <div>loading</div>:
                <div className="comment_field_container">
                    <textarea id = 'comment_field' className="comment_field" value={commentContent}></textarea>
                </div>
                }
            </div>
        </div>
    )
}

export default CommentSection