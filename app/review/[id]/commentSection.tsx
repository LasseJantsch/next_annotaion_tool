import React, { ChangeEvent, useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';


const CommentSection = ({id, activeId, setActiveId, commentContent,}:{id:any, activeId:any, setActiveId:React.Dispatch<React.SetStateAction<string>>, commentContent: string}) => {
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        if (true) {
            setLoading(false)
        }
    },[])


    return(
        <div id={id} className={id === activeId? "comment_section active":"comment_section"} onClick={()=>setActiveId(id)}>
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