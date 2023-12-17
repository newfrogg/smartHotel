import $ from 'jquery'
import { LINK_ROOM } from "../apiLink";


export default function authorize(username,password){
    return $.ajax({
        method: 'POST',
        url: `${LINK_ROOM}/login/${username}`,
        crossDomain: true,
        data:`"${password}"`,
        contentType: 'application/json'
    })
}