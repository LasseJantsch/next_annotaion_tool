import React from 'react'
import EditIcon from '@mui/icons-material/Edit';
import BackspaceIcon from '@mui/icons-material/Backspace';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface Props {
    activeTool: any
    handleToolChange: any,
    handleResetAnnotation: any,
}
interface SetProps {
    children: React.ReactNode,
}
interface ButtonProps {
    active?: boolean,
    title: string,
    shortcut: string,
    color: string,
    children: React.ReactNode,
    handleClick: any,
}

const ToolButtonSet: React.FC<SetProps> = ({
    ...props
}) => {

    return(
        <div className='tool_button_set'>
            {props.children}
        </div>
    )
}

const ToolButton: React.FC<ButtonProps> = ({
    active= false,
    title,
    shortcut,
    color,
    handleClick,
    ...props
}) => {

    return(
        <div className='tool_button_container'>
            <button className={`tool_button ${active && 'active'}`} onClick={()=> handleClick(title)} style={{backgroundColor: active ? color: '#ffffff', boxShadow: active ? `0 0 0px 2px ${color}`: '', zIndex: active? 2: 0}}>
                {props.children}
            </button>
            <div className='tool_button_description'>{title}</div>
            <div className='tool_button_shortcut' style={{backgroundColor: color, zIndex: 3}}>{shortcut}</div>
        </div>
    )
}

const AnnotationTools: React.FC<Props> = ({
    activeTool,
    handleToolChange,
    handleResetAnnotation,
}) => {
    const toolDescription = ['information', 'perception', 'background', 'erase']
    const toolColors = ['#21BE31','#FEC600','#CC00FF','#5E5E5E']
    const shortcuts = ['1', '2', '3', '4']

    return (
        <div className="tools_container">
            <ToolButtonSet>
                {toolDescription.map((d, i) => {
                    const status = activeTool === d? true: false
                    return(
                        <ToolButton active={status} title={d} color={toolColors[i]} shortcut={shortcuts[i]} handleClick={handleToolChange}>
                            {d==='erase'? <BackspaceIcon style={{color: status ? '#fff': toolColors[i]}}/>: <EditIcon style={{color:false ?'#fff': toolColors[i]}}/>}
                        </ToolButton>
                    )
                })}
            </ToolButtonSet>
            <ToolButtonSet>
                <ToolButton title='reset' color='#5e5e5e' shortcut='9'  handleClick={handleResetAnnotation}>
                    <RestartAltIcon style={{color:'#5e5e5e'}}/>
                </ToolButton>
            </ToolButtonSet>
        </div>
    )
}

export default AnnotationTools