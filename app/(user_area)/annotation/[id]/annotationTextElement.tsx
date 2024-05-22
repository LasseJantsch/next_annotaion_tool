import React from "react";

const AnnotationTextElement = ({id, i, s, mark, setShowInfo}: {id: string, i: number, s: string, mark: number, setShowInfo: React.Dispatch<React.SetStateAction<string>>}) => {
    var classList = 'text'
    if (s.includes('TREF]')){
        classList += ' target'
    }
    if (s.includes('REF]')) {
        classList += ' reference'
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
            <span id={id + '_' + i} key={id + '_' + i} className={classList} onClick={()=>s.includes('REF]')&&setShowInfo('info_card')}>{s}</span>
            <span id={id + '_' + i + '_filler'} className="filler"> </span>
        </>
    )
}

export default AnnotationTextElement