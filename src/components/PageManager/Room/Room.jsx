import React from "react";

import RoomList from "../../RoomList/RoomList";
import RoomView from "../../RoomView/RoomView";
import RoomCreation from "../../RoomCreation/RoomCreation";
export default function Room(){
    const [roomDetail, setRoomDetail] = React.useState(undefined);
    let page = <RoomList roomDetail={roomDetail} setRoomDetail={setRoomDetail}/>
    if(roomDetail === true){
        page = <RoomCreation roomDetail={roomDetail} setRoomDetail={setRoomDetail}/>
    }
    else if (roomDetail !== undefined){
        page = <RoomView roomDetail={roomDetail} setRoomDetail={setRoomDetail}/>
    }
    
    return page;
}