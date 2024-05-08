import React, { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const InfoCard = ({title, authors, pub_year,setShowInfoCard}:{title:string, authors:string[], pub_year: number, setShowInfoCard:React.Dispatch<React.SetStateAction<boolean>>}) => {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (title && authors && pub_year) {
            setLoading(false)
        }
    }, [title, authors, pub_year])
    
    return(
        <div id='info_card' className={"info_card active"}>
            <div className="info_card_navigation_container">
                <div className="info_more_container">
                </div>
                <div className="info_close_container">
                    <button className="info_button" onClick={()=>setShowInfoCard(false)}>
                        <CloseIcon className="info_button_icon" />
                    </button>
                </div>
            </div>
            {loading?
            <div>loading</div>:
            <div className="info_content_container">
                <div className="info_title_container">
                    <div className="info_tilte">{title}</div>
                </div>
                <div className="info_meta_container">
                    <div className="info_meta">{pub_year}: {authors.length < 4 ? authors.map((auth: any) => auth.first_name + ' ' + auth.last_name).join(', '): authors[0] + ' et al.'}</div>
                </div>
            </div>}
        </div>
    )
}
export default InfoCard