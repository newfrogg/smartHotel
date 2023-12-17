import React from "react";

import './DetailCard.css'
export default function DetailCard({keyStatus,valueStatus}){
    const style = {
        "roomType":{
            "label": "Room Type"
        },
        "roomPrice":{
            "label": "Room Price"
        },
        "roomCapacity":{
            "label": "Room Capacity"
        },
        "roomStatus":{
            "label": "Room Status"
        }
    }
    return (
        <div className="detail-wrapper">
            <div className="detail">
                <div className="detail-title">
                    {style[keyStatus].label}
                </div>
                <div className="detail-value">
                    {valueStatus}
                </div>
                <div className="detail-buffer">
                    
                </div>
            </div>
        </div>
    )
}