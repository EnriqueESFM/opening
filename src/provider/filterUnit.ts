import Base64 from '../helpers/Base64.js';
import {GlobalString} from '../helpers/GlobalString.js';
export const filterUnit = async(filtro : string) => {
    const URLService = `${mainURL}`;
    const resp = await (await fetch(URLService,{
        headers:{    
            'Accept': 'application/json',                                                    
            'Content-Type': 'application/json',
            'Authorization': 'Basic '+Base64.btoa(`${GlobalString.user}:idsession_${GlobalString.id_session}_${GlobalString.idaplication}`)
        },
        method:"POST",
        body:JSON.stringify({
            id_aplicacion:GlobalString.idaplication,
            filtro
        })
    })).json();
    return resp;
}

const mainURL = "https://www.poderonline.net:8011/admin/unit";