'use client'
import React, { useEffect, useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from "@/utils/supabase/client";
import ErrorBanner from "./errorBanner";
import { useRouter } from "next/navigation";

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
                    <MenuIcon className="menu_icon"/>
                </button>:
                <button className={'menu_button'} onClick={handleBackClick}>
                    <ArrowBackIcon className="menu_icon"/>
                </button>}
            </div>
            {menuOpen &&
            <>
            <div className="menu_card_container">
                <div className="menue_card_item_container">
                   <Link href='/'><button id='menu_card_item_1' className="menu_card_item">Overview</button></Link>
                </div>
                <div className="menue_card_item_container">
                    <Link href='/guidelines'><button id='menu_card_item_2' className="menu_card_item">Guidelines</button></Link>
                </div>
                <div className="menue_card_item_container">
                    <button id='menu_card_item_2' className="menu_card_item" onClick={handleSignOut}>Sign Out</button>
                </div>
            </div>
            <div className="menu_card_backdrop" onClick={handleMenuClick} />
            </>}
        </div>
    )
}

export default Header