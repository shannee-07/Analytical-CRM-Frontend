import React, {useEffect} from 'react'
import { useState } from "react";

import './layout.css'

import Sidebar from '../sidebar/Sidebar'
import TopNav from '../topnav/TopNav'
import Routes from '../Routes'
import {tokenExpired} from "../../api/callAPI.js"
import Login from '../../pages/Login.jsx';

import { BrowserRouter, Route } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'

import ThemeAction from '../../redux/actions/ThemeAction'

const Layout = () => {

    const themeReducer = useSelector(state => state.ThemeReducer)
    const [tokExpired, setTokenExpired] = useState(true);

    const dispatch = useDispatch()

    const tokenGenerated= ()=>{
        setTokenExpired(false);
    }

    async function isExpired(){
        const expired = await tokenExpired();
        if(expired){
            alert("expired");
            setTokenExpired(true);
        }else{
            // alert("Token available")
            setTokenExpired(false);
        }
    }

    useEffect(() => {
        const themeClass = localStorage.getItem('themeMode', 'theme-mode-light')

        const colorClass = localStorage.getItem('colorMode', 'theme-mode-light')

        dispatch(ThemeAction.setMode(themeClass))

        dispatch(ThemeAction.setColor(colorClass))
        isExpired();
    }, [dispatch])

    // return (
        // <div className="center">
        //     Hello duniya
        // </div>
    //   );

    return (
        <>
        {
            tokExpired?(<Login tokenGeneratedSuccessfully={tokenGenerated}/>):
            
        <BrowserRouter>
            <Route render={(props) => (
                <div className={`layout ${themeReducer.mode} ${themeReducer.color}`}>
                    <Sidebar {...props}/>
                    <div className="layout__content">
                        <TopNav/>
                        <div className="layout__content-main">
                            <Routes />
                        </div>
                    </div>
                </div>
            )}/>
        </BrowserRouter>
        }
        </>
    )
}

export default Layout
