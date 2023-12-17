import $ from 'jquery'

import { LINK_ROOM } from './apiLink'

export default function getAllRoom(){
    return $.ajax({
        method: 'GET',
        url: `${LINK_ROOM}/currentRoom`,
        crossDomain: true,
        contentType: 'application/json'
    })
}