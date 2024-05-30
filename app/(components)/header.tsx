'use client'
import React, { useEffect, useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from "@/utils/supabase/client";
import ErrorBanner from "./errorBanner";
import { useRouter } from "next/navigation";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from "./iconButton";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LogoutIcon from '@mui/icons-material/Logout';


const Header = () => {
    const supabase = createClient()
    const [menuOpen, setMenuOpen] = useState(false)
    const [error, setError] = useState('')
    const pathname = usePathname()
    const router = useRouter()
    
    if (pathname.match(/annotation/) || pathname.match('\/review\/.*')){
        var showMenu = false
    }else { 
        var showMenu = true
    }

    const handleMenuClick = () => {
        setMenuOpen(!menuOpen)
    }
    const handleBackClick = () => {
        if(pathname.match('\/review\/.*')){
            window.location.replace('/review')
        } else {
            window.location.replace("/")
        }
    }

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            setError('issue signing out')
        }
        router.push('/login')
    }
    return(
        <div className="header">
           {error && <ErrorBanner message={error} setError={setError}/>}
            <div className="menu_container">
                {showMenu?
                <button className="menu_button" onClick={handleMenuClick}>
                    {!menuOpen? <MenuIcon className="menu_icon"/>: <CloseIcon className="menu_icon"/>}
                </button>:
                <button className={'menu_button'} onClick={handleBackClick}>
                    <ArrowBackIcon className="menu_icon"/>
                </button>}
            </div>
            <div className={`menu_card_container ${menuOpen && 'active'}`} >
                <div className="menue_card_item_container">
                        <IconButton title="Annotation" link="/" icon_position="left">
                            <EditIcon/>
                        </IconButton>
                </div>
                <div className="menue_card_item_container">
                    <IconButton title="Review" link="/review" icon_position="left">
                        <VisibilityIcon/>
                    </IconButton>
                </div>
                <div className="menue_card_item_container"></div>
                <div className="menue_card_item_container">
                    <IconButton title="Sign Out" onClick={handleSignOut} icon_position="left">
                        <LogoutIcon/>
                    </IconButton>
                </div>
            </div>
            {menuOpen &&<div className="menu_card_backdrop" onClick={handleMenuClick} />}
        </div>
    )
}

export default Header