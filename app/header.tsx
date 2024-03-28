'use client'
import React, { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link'

const Header = ({title, show_menu}:{title: string, show_menu: boolean}) => {
    const [menuOpen, setMenuOpen] = useState(false)

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen)
    }
    const handleBackClick = () => {
        window.location.replace("/")
    }

    return(
        <div className="header">
            <div className="menu_container">
                {show_menu?
                <button className="menu_button" onClick={handleMenuClick}>
                    <MenuIcon className="menu_icon"/>
                </button>:
                <button className={'menu_button'} onClick={handleBackClick}>
                    <ArrowBackIcon className="menu_icon"/>
                </button>}
            </div>
            <div className="title_container">
                <div className="title">{title}</div>
            </div>
            {menuOpen &&
            <>
            <div className="menu_card_container">
                <div className="menue_card_item_container">
                   <Link href='/'><button id='menu_card_item_1' className="menu_card_item">Overview</button></Link>
                </div>
                <div className="menue_card_item_container">
                    <Link href='/annotation'><button id='menu_card_item_2' className="menu_card_item">Guidelines</button></Link>
                </div>
            </div>
            <div className="menu_card_backdrop" onClick={handleMenuClick} />
            </>}
        </div>
    )
}

export default Header