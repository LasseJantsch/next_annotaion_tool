import React from 'react'
import BasicBox from './basicBox';
import TableHeaderElement from './tableHeaderElement';

interface Props {
    title: string;
    columnNames: string[],
    columnWidth: number[],
    classNames?: string;
    children: React.ReactNode,
}

const Table: React.FC<Props> = ({
    title,
    columnNames,
    columnWidth,
    classNames,
    ...props
}) => {

    return (
        <div className={`table_container ${classNames}`}>
            <BasicBox title={title} classNames='table_header'>
                  {columnNames.map((n, i) => {
                    return(
                        <TableHeaderElement title={n} width={columnWidth[i]}/>
                    )
                  })}
            </BasicBox>
            <div className='table_content'>{props.children}</div>
        </div>
    )
}

export default Table