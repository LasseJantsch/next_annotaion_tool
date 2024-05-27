import React from "react";
import Link from "next/link";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { usePathname } from 'next/navigation'

const findColor = (status: string, pathname:string) => {
    if (pathname.match(/review/)){
        if (status === 'null') {
            return('#D9D9D9')
        } else if (parseFloat(status) < 0.6) {
            return('#FF0000')
        } else if (parseFloat(status) < 0.8) {
            return('#FFAE34')
        }else {
            return('#00D416')
        }
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
        <div key={`${title}_text_entry`} className="text_entry" style={{width: width}}>
            {title}
        </div>
    )
}

const StatusEntry = ({title, width, color}:{title:string, width:number, color:string}) => {
    return(
        <div key={`status_entry`} className="status_entry" style={{width: width}}>
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
        <div key={`icon_entry`} className={`icon_entry ${classNames}`} style={{width: width}}>
            {content&&<span className="icon_entry_content">{content}</span>}
            {props.children}
        </div>
    )
}

const ActionEntry = ({title, width, link}:{title:string, width:number, link:string}) => {
    return(
        <Link key={`action_entry`} href={link} className="action_entry_link">
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
    const pathname = usePathname()

    return(
        <div key={`${data[0]}_entry`} className="table_entry_container">
            {columnSpecification.map((s, i) => {
                switch (s){
                    case 'text_entry':
                        return(<TextEntry key={i} title={data[i]} width={columnWidth[i]}/>)
                    case 'status_entry':
                        return(<StatusEntry key={i} title={data[i]} width={columnWidth[i]} color={findColor(String(data[i]),pathname)}/>)
                    case 'icon_entry':
                        return(<IconEntry key={i} classNames={data[i]&& 'active'} content={data[i]} width={columnWidth[i]}><ChatOutlinedIcon/></IconEntry>)
                    case 'action_entry':
                        if (pathname.match(/review/)){var link = `/review/${data[i]}`}
                        else {var link = `/annotation/${data[i]}`}
                        return(<ActionEntry key={i} title={'edit'} width={columnWidth[i]} link={link}/>)
                }
            })}
        </div>
    )
}

export default TableEntry