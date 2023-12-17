import React from "react";

import './StatusCard.css';
export default function StatusCard({keyStatus,valueStatus}){
    const style = {
        "temperature":{
            "style":{
                "background": "linear-gradient(180deg, rgb(241, 100, 33), rgb(255, 180, 174))"
            },
            "label": "Temperature",
            "unit": "°C",
            "icon": <i className="fa-solid fa-temperature-three-quarters"></i>
        },
        "moisture":{
            "style":{
                "background": "linear-gradient(180deg, rgb(0, 150, 255), rgb(92, 236, 255))"
            },
            "label":"Moisture",
            "unit": "g/m³",
            "icon": <i className="fa-solid fa-droplet"></i>
        },
        "lightLevel":{
            "style":{
                "background": "linear-gradient(180deg, rgb(206, 175, 0), rgb(245, 241, 3))"
            },
            "label": "Light Level",
            "unit": "lux",
            "icon": <i className="fa-solid fa-bolt-lightning"></i>
        }
    }
    return (
        <div className="status-wrapper">
            <div className="status" style={style[keyStatus].style}>
                <div className="status-val">
                    <div className="status-text">
                        <div className="status-title">
                            {valueStatus}
                        </div>
                        <div className="status-unit">
                            {style[keyStatus].unit}
                        </div>
                    </div>
                    <div className="status-icon">
                        {style[keyStatus].icon}
                    </div>
                </div>
                <div className="status-key">
                    {style[keyStatus].label}
                </div>
            </div>
        </div>
    )
}