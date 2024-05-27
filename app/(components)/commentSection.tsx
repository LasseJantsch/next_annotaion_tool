import React, { ChangeEvent, useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import BasicBox from "@/app/(components)/basicBox";


const CommentSection = ({commentContent, name, id, setActiveAnnotation, setCommentContent}:{commentContent: string, name?:string, id?:string, setActiveAnnotation?:React.Dispatch<React.SetStateAction<string>>, setCommentContent?:React.Dispatch<React.SetStateAction<string>>}) => {
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        if (true) {
            setLoading(false)
        }
    },[])

    var handleCommentInput = (e:ChangeEvent<HTMLTextAreaElement>) => {
        setCommentContent && setCommentContent(e.target.value)
    }
    var handleClick = (e:ChangeEvent<HTMLTextAreaElement>) => {
        setActiveAnnotation && id && setActiveAnnotation(id)
    }


    return(
        <BasicBox id={id? id: 'comment_section'} title={name? name :"Comment"} classNames="comment_section" shortcut="C" onClick={handleClick}>
                <div className="comment_field_container">
                    <textarea id="comment_field" value={commentContent} disabled={setCommentContent? false: true} onChange={handleCommentInput}></textarea>
                </div>
        </BasicBox>
    )
}

export default CommentSection