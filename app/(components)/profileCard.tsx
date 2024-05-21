import React from "react";
import { usePathname } from 'next/navigation'
import BasicBox from "./basicBox";
import IconButton from "./iconButton";
import EastIcon from '@mui/icons-material/East';


const ProfileCard = ({ratios, count, user_name, nextAnnotationId}:{ratios:number[], count:number[], user_name:string, nextAnnotationId:string}) => {

    const pathname = usePathname()

    if (pathname.match(/review/)){
        var colors:string[] = ['']
        var description:string[] = ['']
        if (nextAnnotationId) {
            var nextElementLink = `/review/${nextAnnotationId}`
        } else {
            var nextElementLink = ''
        }
    }else { 
        var colors:string[] = ['#00D416', '#FFAE34', '#D9D9D9']
        var description:string[] = ['Annotated', 'Skipped', 'Outstanding']
        if (nextAnnotationId) {
        var nextElementLink = `/annotation/${nextAnnotationId}`
        } else {
            var nextElementLink = ''
        }
    }

    const progress_bar_width = ratios.map((r, i) => {
        var res = 0
        for(var j = 0; j <= i; j++) {
            res += 560*ratios[j]
        }
        return res
    })

    return(
    <BasicBox title="Profile" classNames="profile_card_container">
        <div className="profile_card_div">
            <div className="title">{user_name}</div>
            {ratios &&
            <div className="progress_bar_container">
                <div className="progress_bar">
                {progress_bar_width.map((r, i ) => {
                    return(
                        <div id ={`progress_bar_${i}`} className="progress_bar_element" style={{width: `${r}px`, backgroundColor: colors[i], boxShadow: `0 0 4px ${colors[i]}`, zIndex: ratios.length-i}}></div>
                    )
                })} 
                </div>
            </div>}
        </div>
        <div className="profile_card_div">
            <div className="progress_count_container">
                {count.map((c, i) => {
                    return (
                        <div id={`progress_count_element_${i}`} className="progress_count_element">
                            <div className="progress_count_number">{c}</div>
                            <div className="progress_count_indicator" style={{backgroundColor: colors[i]}}></div>
                            <div className="progress_count_description">{description[i]}</div>
                        </div>
                    )
                })}
            </div>
        </div>
            <IconButton title='Start Annotation' classNames ='start_annotation_button' link={nextElementLink}>
                <EastIcon />
            </IconButton>
    </BasicBox>
    )
}

export default ProfileCard