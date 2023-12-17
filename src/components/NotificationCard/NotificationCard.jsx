import React from "react";

import "./NotificationCard.css"
export default function NotificationCard(){
    return(
        <div className="noti-card-wrapper">
            <div className="noti-card">
                <div className="noti-title">
                    Notification
                </div>
                <div className="noti-icon">
                    <i className="fa-solid fa-note-sticky"></i>
                </div>
                <div className="noti-status">
                    Create a Note here!
                </div>
            </div>
        </div>
    );
}