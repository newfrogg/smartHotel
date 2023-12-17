import $ from 'jquery'

import { LINK_ROOM } from './apiLink'

export default function delRoom(id){
    return $.ajax({
        method: 'DELETE',
        url: `${LINK_ROOM}/room/${id}`,
        crossDomain: true,
        contentType: 'application/json'
    })
}