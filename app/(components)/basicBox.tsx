import React from 'react'

interface Props {
    id: string,
    title?: string;
    shortcut?: string;
    classNames?: string;
    handleExpand?: any;
    expanded?: boolean;
    onClick?: any;
    children: React.ReactNode,
}

const BasicBox: React.FC<Props> = ({
    id,
    title,
    classNames,
    shortcut = '',
    expanded,
    handleExpand,
    onClick,
    ...props
}) => {

    return (
        <div id={id} className={`basic_border_box ${classNames}`} onClick={onClick}>
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