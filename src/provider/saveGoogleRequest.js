import { DBTransaction } from "../helpers";

export const saveGoogleRequest = (type,points,response,idUsuario,comment,origin) => {
    const DB = new DBTransaction();
    var strPoints ="";
    for (var i = 0; i < points.length; i++) {
        strPoints+=",Point("+points[i].lat()+","+points[i].lng()+")";
    }
    if(points.length<2)
        strPoints+=strPoints;
    DB.ejecutarSentenciaAsincrono("","","","",1860,type+"|"+strPoints.substring(1)+"|"+response+"|"+idUsuario+"|"+comment+"|"+origin,"",(table)=>{
        let resp = table;        
    },null,()=>{},"https://www.skymeduza.com/aplicacion/servicio/DBComando.php");
}