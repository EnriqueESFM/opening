import Base64 from '../helpers/Base64.js';
import {GlobalString} from '../helpers/GlobalString.js';
export const getOpening = async(units:Array<number>,start : string, finish: string, time : number, byStay : boolean = false,stops : Array<string> = []) => {
    const URLService = `${mainURL}`;
    const resp = await (await fetch(URLService,{
        headers:{    
            'Accept': 'application/json',                                                    
            'Content-Type': 'application/json',
            'Authorization': 'Basic '+Base64.btoa(`${GlobalString.user}:idsession_${GlobalString.id_session}_${GlobalString.idaplication}`)
        },
        method:"POST",
        body:JSON.stringify({
            unidad:units,
            inicio:start,
            fin:finish,
            tiempo:time,
            estancia:byStay,
            paradero:stops
        })
    })).json();
    return resp;
}

const mainURL = "https://www.poderonline.net:8011/report/opening/";