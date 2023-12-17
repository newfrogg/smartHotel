import $ from 'jquery'

import { LINK_ROOM } from './apiLink'

function setSensorControl(roomId,type,status){
    return $.ajax({
        method: 'POST',
        url: `${LINK_ROOM}/control?roomNumber=${roomId}&type=${type}&status=${status}`,
        crossDomain: true,
        contentType: 'application/json'
    })
}

export {setSensorControl}