import React from "react";

const AnnotationTextElement = ({id, i, s, mark, handleClick}: {id: string, i: number, s: string, mark: number, handleClick: any}) => {
    var classList = 'text'
    if (s.includes('<tref')){
        if (s.includes('single')){
            s = '[TREF]'
        } else {
            s = '[GTREF]'
        }
        classList += ' target'
    }
    if (s.includes('<ref')) {
        classList += ' reference'
        if (s.includes('single')){
            s = '[REF]'
        } else {
            s = '[GREF]'
        }
    }
    switch(mark){
        case 0:
            break
        case 1:
            classList += ' marked info'
            break
        case 2:
            classList += ' marked judge'
            break
        case 3:
            classList += ' marked backgr'
            break
    }

    return(
        <>
            <span id={id + '_' + i} className={classList} onClick={()=>s.includes('REF]')&&handleClick(i)}>
                {classList.includes('target')&& <div className="target_annotation_marker"/>}
                {s}
            </span>
            <span id={id + '_' + i + '_filler'} className="filler"> </span>
        </>
    )
}

export default AnnotationTextElement