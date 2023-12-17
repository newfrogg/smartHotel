import React from "react";

import { setSensorControl } from "../../api/sensorControl";
import { formatSensorList } from "../../api/sensorList";

import "./ControlCard.css"
export default function ControlCard({keyStatus,valueStatus,room,setSensorDataList}){
    const status = {
        "lightStatus":{
            "label": "Lamp",
            "icon": <i className="fa-solid fa-lightbulb"></i>,
            "status":{
                "on": "On",
                "off": "Off"
            }
        },
        "fanStatus":{
            "label": "Fan",
            "icon": <i className="fa-solid fa-fan"></i>,
            "status":{
                "on": "Spinning",
                "off": "Stopped"
            }
        },
        "rotorStatus":{
            "label": "Curtain",
            "icon": <i className="fa-solid fa-mattress-pillow"></i>,
            "status":{
                "on": "Opened",
                "off": "Closed"
            }
        }
    }
    return (
        <div className="control-wrapper">
            <div className={"control " + `control-${valueStatus?"on":"off"}`} 
                onClick={()=>{
                    setSensorControl(room,keyStatus,!valueStatus).then(
                        el => formatSensorList(room)
                    ).then(
                        setSensorDataList
                    )
                }}
            >
                <div className="control-title">
                    {status[keyStatus].label}
                </div>
                <div className="control-icon">
                    {status[keyStatus].icon}
                </div>
                <div className="control-status">
                    {valueStatus?status[keyStatus].status.on:status[keyStatus].status.off}
                </div>
            </div>
        </div>
    )
}