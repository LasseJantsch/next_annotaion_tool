import React  from "react";
import Guidelines from "../../guidelines/guidelines";
import CloseIcon from '@mui/icons-material/Close';


const GuidelineElement = ({setShowGuidelineElement}:{ setShowGuidelineElement:React.Dispatch<React.SetStateAction<boolean>>}) => {

    return(
        <div className='guideline_element_container'>
            <div className="guideline_element">
                <div className="guideline_element_header">
                    <button className="comment_button" onClick={()=>setShowGuidelineElement(false)}>
                        <CloseIcon className="comment_button_icon" />
                    </button>
                </div>
                <div className="guideline_element_content_container">
                    <Guidelines />
                </div>
            </div>
            <div className="guideline_elment_backdrop" onClick={()=>setShowGuidelineElement(false)}></div>
        </div>
    )
}

export default GuidelineElement