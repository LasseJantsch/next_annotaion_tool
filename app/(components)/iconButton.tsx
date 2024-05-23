import React from "react";
import { useRouter } from 'next/navigation';

interface Props {
    title: string;
    classNames?: string;
    icon_position?: string;
    children: React.ReactNode,
    link: string
}

const IconButton: React.FC<Props> = ({
    title,
    classNames,
    icon_position = 'right',
    link,
    ...props
}) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(link);
      };
    return(
        <button className={`icon_button ${classNames}`} onClick={e => handleClick()} disabled={link? false: true}>
            {icon_position === 'left' && <div className="icon_button_icon">{props.children}</div>}
            <div className="icon_button_title">{title}</div>
            {icon_position === 'right' && <div className="icon_button_icon">{props.children}</div>}
        </button>
    )
}

export default IconButton