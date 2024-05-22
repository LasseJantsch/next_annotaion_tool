import React, { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import BasicBox from "@/app/(components)/basicBox";
import { returnAuthorString } from "./helper";
const InfoCardElement = ({paper, section}:{paper:any, section?: string}) => {
    return(
        <div className="info_card_element">
            <div className="info_card_element_title">{paper.title}</div>
            <div className="info_card_element_meta">{`${paper.pub_year} - ${returnAuthorString(paper.authors)}`}</div>
            {section && <div className="info_card_element_section_name">{`Section: ${section}`}</div>}
        </div>
    )
}

const InfoCard = ({title, papers, section}:{title:string, papers:Array<any>, section?:string}) => {
  
    return(
        <BasicBox title={title} classNames="info_card active" shortcut="Space">
            <div className="info_card_content">
                {papers.map((p: any, i:number) => {
                    return(
                        <InfoCardElement paper={p} section={section}/>
                    )
                })}
            </div>
        </BasicBox>
    )
}
export default InfoCard