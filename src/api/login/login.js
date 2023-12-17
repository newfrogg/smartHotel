import { setCookie, getCookie } from "../../utils/cookie";
import authorize from "./authorization";

async function login_inner(username,password){
    return await authorize(username,password).then(
        data => {
            if(data.status){
                let name = `${data.data.firstName} ${data.data.lastName}`
                console.log(data);
                setCookie("user",name,0.5/24)
                return true
            }
            else{
                return false
            }
        }
    )
}
function getUsername(){
    return getCookie("user");
}
export {login_inner,getUsername}
