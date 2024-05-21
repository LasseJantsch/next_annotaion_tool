import React from "react";
import Link from "next/link";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { usePathname } from 'next/navigation'

const findColor = (status: string) => {
    const pathname = usePathname()
    if (pathname.match(/review/)){
        return('#D9D9D9')
    }else { 
        switch (status) {
            case 'annotated':
                return('#00D416')
            case 'skipped':
                return('#FFAE34')
            case 'outstanding':
                return('#D9D9D9')
            default:
                return('#D9D9D9')
        }
    }
}

interface IconProps {
    classNames?: string;
    width: number,
    content: string,
    children: React.ReactNode,
}

interface Props{
    classNames?: string;
    columnWidth: number[];
    columnSpecification: string[]
    data: any;
}

const TextEntry = ({title, width}:{title:string, width:number}) => {
    return(
        <div className="text_entry" style={{width: width}}>
            {title}
        </div>
    )
}

const StatusEntry = ({title, width, color}:{title:string, width:number, color:string}) => {
    return(
        <div className="status_entry" style={{width: width}}>
            <div className="status_entry_indicator" style={{backgroundColor:color}}></div>
            <div className="status_entry_description">{title}</div>
        </div>
    )
}

const IconEntry: React.FC<IconProps> = ({
    classNames,
    width,
    content,
    ...props
}) => {
    return(
        <div className={`icon_entry ${classNames}`} style={{width: width}}>
            {content&&<span className="icon_entry_content">{content}</span>}
            {props.children}
        </div>
    )
}

const ActionEntry = ({title, width, link}:{title:string, width:number, link:string}) => {
    return(
        <Link href={link} className="action_entry_link">
            <button className="action_entry" style={{width: width}}>{title}</button>
        </Link>
    )
}

const TableEntry: React.FC<Props> = ({
    classNames,
    columnWidth,
    columnSpecification,
    data,
}) => {

    return(
        <div className="table_entry_container">
            {columnSpecification.map((s, i) => {
                switch (s){
                    case 'text_entry':
                        return(<TextEntry title={data[i]} width={columnWidth[i]}/>)
                    case 'status_entry':
                        return(<StatusEntry title={data[i]} width={columnWidth[i]} color={findColor(data[i])}/>)
                    case 'icon_entry':
                        return(<IconEntry classNames={data[i]&& 'active'} content={data[i]} width={columnWidth[i]}><ChatOutlinedIcon/></IconEntry>)
                    case 'action_entry':
                        const link = `/annotation/${data[i]}`
                        return(<ActionEntry title={'edit'} width={columnWidth[i]} link={link}/>)
                }
            })}
        </div>
    )
}

export default TableEntry