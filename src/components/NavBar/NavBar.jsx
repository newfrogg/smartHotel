import React from "react";
import { useNavigate,useLocation } from "react-router-dom";

import './NavBar.css';
import { getUsername } from "../../api/login/login";
import logo from "/logo.png";


export default function NavBar(){
    const navigate = useNavigate();
    const location = useLocation();
    let checkPage = true;
    let text="";
    if(location.pathname == "/menu"){
        const user = getUsername();
        if(!user){
            checkPage=false;
        }
        else{
            text = `Welcome Manager ${user}`;
        }
    }
    else{
        text = "Please login to continue";
    }

    React.useEffect(()=>{
        if(!checkPage){
            navigate("/");
        }
    })
    return(
        <div className="navbar">
            <div className="nav-comp">
                <div className="logo">
                    <img src={logo} alt="Hi" className="logo_img"/>
                    <p className="logo_text">Hotel です</p>
                </div>
            </div>
            <div className="comp-name nav-comp">
                <h1>Hotel Manager</h1>
            </div>
            <div className="welcome nav-comp">
                <p>{text}</p>
            </div>
        </div>
    )
}