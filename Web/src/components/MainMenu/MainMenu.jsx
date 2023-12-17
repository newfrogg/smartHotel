import React from "react";


import Notification from "../PageManager/Notification/Notification";
import Customer from "../PageManager/Customer/Customer";
import Room from "../PageManager/Room/Room";

export default function MainMenu({state,setState}){
    var res = <Room/>;
    if(state == 1){
        res = <Customer/>
    }
    else if (state == 2){
        res = <Notification/>
    }
    return (
        <div className="main-menu">
            {res}
        </div>
    )
}