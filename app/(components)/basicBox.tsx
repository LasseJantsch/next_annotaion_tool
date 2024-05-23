import React from 'react'

interface Props {
    title?: string;
    shortcut?: string;
    classNames?: string;
    handleExpand?: any;
    expanded?: boolean;
    children: React.ReactNode,
}

const BasicBox: React.FC<Props> = ({
    title,
    classNames,
    shortcut = '',
    expanded,
    handleExpand,
    ...props
}) => {

    return (
        <div className={`basic_border_box ${classNames}`}>
            <div className='basic_border_box_title'>{title}</div>
            {shortcut&&<div className='basic_border_box_shortcut'>{shortcut}</div>}
            <div className='basic_border_box_content'>
                {props.children}
            </div>
            {handleExpand && !expanded && <div className='basic_border_box_expand' onClick={()=>handleExpand(true)}>{'more >>'}</div>}
            {handleExpand && expanded && <div className='basic_border_box_expand' onClick={()=>handleExpand(false)}>{'<< less'}</div>}
        </div>
    )
}

export default BasicBox