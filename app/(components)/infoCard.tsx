import React, { useEffect, useState } from "react";
import BasicBox from "@/app/(components)/basicBox";
import { returnAuthorString } from "../(helpers)/helper";


const InfoCard = ({title, papers, sectionTitle, sectionContent, target, expanded, handleExpand}:{title:string, papers:Array<any>, sectionTitle?:string, target?:string, sectionContent?:string[],expanded?:boolean, handleExpand?: any}) => {
    return(
        <BasicBox title={title} classNames="info_card" shortcut="Space" expanded={expanded} handleExpand={handleExpand}>
            <div className="info_card_content">
                {papers.map((p: any, i:number) => {
                    return(
                        <div key={i} id={p.id} className={`info_card_element ${p.id===target&& 'target'}`}>
                            <div className="info_card_element_title">{p.title}</div>
                            <div className="info_card_element_meta">{`${p.pub_year} - ${returnAuthorString(p.authors)}`}</div>
                            {sectionTitle && <div className="info_card_element_section_name">{`Section: ${sectionTitle}`}</div>}
                            {sectionContent && expanded && 
                            <div className="info_card_element_section_container">
                                {sectionContent.map((c, i )=> {
                                    return(
                                        <div key={i} className="info_card_element_section_content">{c}</div>
                                    )
                                })}
                            </div>    
                            }
                        </div>
                    )
                })}
            </div>
        </BasicBox>
    )
}
export default InfoCard