import React from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { getRoomList } from "../../api/roomList";

import roomlistTest from '../../data/roomList.json';

import './RoomList.css'
function setColor(s){
    let disabled = {
        "backgroundColor": "var(--status-off)",
        "color": "var(--status-text-off)"
    };
    let enabled = {
        "backgroundColor": "var(--status-on)",
        "color": "var(--status-text-on)"
    };;
    return ((s=="Vacant")?enabled:disabled);
}
export default function RoomList({roomDetail,setRoomDetail}) {
    const [roomCache, setRoomCache] = React.useState([]);
    const [roomlist, setRoomlist] = React.useState([]);
    const [roomQuery,setRoomQuery] = React.useState("");
    React.useEffect(() => {
        getRoomList().then(
            el => {
                setRoomCache(el)
                setRoomlist(el)
            }
        );
    }, [roomDetail]);
    React.useEffect(() => {
        if(roomQuery===""){
            setRoomlist(roomCache)
        }
        else{
            setRoomlist(roomCache.filter(el => String(el.roomNumber).includes(roomQuery)))
        }
    }, [roomQuery]);
    const roomDiv = roomlist.map(el => (
        <div className="room-el-wrapper" key={el.roomNumber}>
            <div 
                className="room-el" 
                key={el.roomNumber} 
                style={setColor(el.roomStatus)}
                onClick={()=>setRoomDetail(el)}
            >
                {el.roomNumber}
            </div>
        </div>

    ))
    return (
        <div className="room">
            <div className="searcher">
                <div className="searcher-wrapper">
                    <Form.Control 
                        type="number" 
                        placeholder="Room Search" 
                        value={roomQuery} 
                        onChange={event => setRoomQuery(event.target.value)}
                    />
                </div>
                <Button    
                    variant="primary" 
                    className="btn-new"
                    onClick={()=>setRoomDetail(true)}
                >
                    New
                </Button>
            </div>
            <div className="roomlist">
                {roomDiv}
            </div>
        </div>
    )
}