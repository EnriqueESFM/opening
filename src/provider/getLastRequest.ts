import Base64 from '../helpers/Base64.js';
import {GlobalString} from '../helpers/GlobalString.js';
export const getLastRequest = async() => {
    const URLService = `${mainURL}`;
    const resp = await (await fetch(URLService,{
        headers:{    
            'Accept': 'application/json',                                                    
            'Content-Type': 'application/json',
            'Authorization': 'Basic '+Base64.btoa(`${GlobalString.user}:idsession_${GlobalString.id_session}_${GlobalString.idaplication}`)
        },
        method:"GET"/*,
        body:JSON.stringify(request)*/
    })).json();
    return resp;
}

const mainURL = "https://www.poderonline.net:8011/report/opening/parameter";