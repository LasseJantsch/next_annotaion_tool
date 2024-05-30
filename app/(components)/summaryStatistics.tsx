import React from "react";
import { usePathname } from 'next/navigation'
import BasicBox from "./basicBox";
import IconButton from "./iconButton";
import EastIcon from '@mui/icons-material/East';


const SummaryStatistics = ({ratios, count, interAnnotationAgreement, nextId}:{ratios:number[], count:number[], interAnnotationAgreement:number[], nextId?:string}) => {

    const pathname = usePathname()
    var colors:string[] = ['#00D416', '#FFAE34', '#D9D9D9']
    var description:string[] = ['Annotated', 'Skipped', 'Outstanding']
    if (nextId) {
    var nextElementLink = `/review/${nextId}`
    } else {
        var nextElementLink = ''
    }

    const progress_bar_width = ratios.map((r, i) => {
        var res = 0
        for(var j = 0; j <= i; j++) {
            res += 400*ratios[j]
        }
        return res
    })

    const findColor = (v:number) => {
        if (v === null) {
          return '#adadad'
        } else if (v < 0.6) {
          return '#FF0000'
        } else if (v<0.8) {
          return '#FFAE34'
        } else {
          return'#00D416'
        }
      }

    return(
    <BasicBox title="Summary Statistics" classNames="profile_card_container">
        <div className="profile_card_div">
            <div className="total_summary">
                <div className="total_prog_summary">
                    <div className="total_prog_title">Total Counts</div>
                    {ratios &&
                    <div className="total_progress_bar_container">
                        <div className="total_progress_bar">
                        {progress_bar_width.map((r, i ) => {
                            return(
                                <div key={i} id ={`progress_bar_${i}`} className="progress_bar_element" style={{width: `${r}px`, backgroundColor: colors[i], boxShadow: `0 0 4px ${colors[i]}`, zIndex: ratios.length-i}}></div>
                            )
                        })} 
                        </div>
                        <div className="total_progress_count_container">
                        {count.map((c, i) => {
                            return (
                                <div key={i} id={`progress_count_element_${i}`} className="progress_count_element">
                                    <div className="progress_count_number">{c}</div>
                                    <div className="progress_count_indicator" style={{backgroundColor: colors[i]}}></div>
                                    <div className="progress_count_description">{description[i]}</div>
                                </div>
                            )
                        })}
                        </div> 
                    </div>}
                </div>
                <div className="profile_iaa_summary">
                    <div className="total_prog_title">Inter Annotation Agreement</div>
                    {interAnnotationAgreement&& 
                    <div className="iaa_container">
                        <div className="total_iaa_container">
                            <div className="total_iaa">
                                <div className="total_iaa_value">{interAnnotationAgreement[0]}</div>
                                <div className="total_iaa_indicator" style={{backgroundColor:findColor(interAnnotationAgreement[0])}}></div>
                                <div className="total_iaa_description">Macro:</div>
                            </div>
                            <div className="total_iaa">
                                <div className="total_iaa_value">{interAnnotationAgreement[1]}</div>
                                <div className="total_iaa_indicator" style={{backgroundColor:findColor(interAnnotationAgreement[1])}}></div>
                                <div className="total_iaa_description">Total:</div>
                            </div>
                        </div>
                        <div className="detail_iaa_container">
                            <div className="detail_iaa">
                                <div className="detail_iaa_value">{interAnnotationAgreement[2]}</div>
                                <div className="detail_iaa_indicator" style={{backgroundColor:findColor(interAnnotationAgreement[2])}}></div>
                                <div className="detail_iaa_description">Information Scope</div>
                            </div>
                            <div className="detail_iaa">
                                <div className="detail_iaa_value">{interAnnotationAgreement[3]}</div>
                                <div className="detail_iaa_indicator" style={{backgroundColor:findColor(interAnnotationAgreement[3])}}></div>
                                <div className="detail_iaa_description">Perception Scope</div>
                            </div>
                            <div className="detail_iaa">
                                <div className="detail_iaa_value">{interAnnotationAgreement[4]}</div>
                                <div className="detail_iaa_indicator" style={{backgroundColor:findColor(interAnnotationAgreement[4])}}></div>
                                <div className="detail_iaa_description">Background Scope</div>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    </BasicBox>
    )
}

export default SummaryStatistics