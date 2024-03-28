import React from "react";
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const InfoCard = ({title, authors, pub_year, abstract, setShowInfoCard}:{title:string, authors:string[], pub_year: number, abstract: string, setShowInfoCard:React.Dispatch<React.SetStateAction<boolean>>}) => {

    return(
        <div id='info_card' className={"info_card active"}>
            <div className="info_card_navigation_container">
                <div className="info_more_container">
                    <button className="info_button">
                        <OpenInNewIcon className="info_button_icon" />
                    </button>
                </div>
                <div className="info_close_container">
                    <button className="info_button" onClick={()=>setShowInfoCard(false)}>
                        <CloseIcon className="info_button_icon" />
                    </button>
                </div>
            </div>
            <div className="info_content_container">
                <div className="info_title_container">
                    <div className="info_tilte">{title}</div>
                </div>
                <div className="info_meta_container">
                    <div className="info_meta">{pub_year}; {authors.map(a => a)}</div>
                </div>
                <div className="info_abstract_container">
                    <div className="info_abstract">{abstract}</div>
                </div>
            </div>
        </div>
    )
}
export default InfoCard