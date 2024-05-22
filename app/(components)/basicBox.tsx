import React from 'react'

interface Props {
    title?: string;
    shortcut?: string;
    classNames?: string;
    children: React.ReactNode,
}

const BasicBox: React.FC<Props> = ({
    title,
    classNames,
    shortcut = '',
    ...props
}) => {

    return (
        <div className={`basic_border_box ${classNames}`}>
            <div className='basic_border_box_title'>{title}</div>
            {shortcut&&<div className='basic_border_box_shortcut'>{shortcut}</div>}
            <div className='basic_border_box_content'>
                {props.children}
            </div>
        </div>
    )
}

export default BasicBox