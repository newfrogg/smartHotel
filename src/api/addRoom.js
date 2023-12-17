import $ from 'jquery'

import { LINK_ROOM } from './apiLink'

export default function addRoom(formItem) {
    console.log(JSON.stringify(formItem))
    return $.ajax({
        method: 'POST',
        url: `${LINK_ROOM}/room`,
        crossDomain: true,
        data: JSON.stringify(formItem),
        contentType: 'application/json'
    })
}