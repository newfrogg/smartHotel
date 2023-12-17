import $ from 'jquery'

import { LINK_ROOM } from './apiLink'

function getRoomList(){
    return $.ajax({
        method: 'GET',
        url: `${LINK_ROOM}/room`,
        crossDomain: true,
        contentType: 'application/json'
    }).then(
        data => data.data.sort(
            (a, b) => {
                let dateA = a.roomNumber;
                let dateB = b.roomNumber;
                if (dateA - dateB < 0) {
                    return -1;
                }
                else if (dateA - dateB > 0) {
                    return 1;
                }
                else return 0;
            }
        )
    )
}

export {getRoomList}