import { DBTransaction } from "../helpers";
export const getUserAsync = (curUser,curIdAplication) => {
    const DB = new DBTransaction();
    return DB.ejecutarAsincrono("","","","",2,`${curUser}|${curIdAplication}`,"","https://www.poderonline.net/paginas/skymeduza2/aplicacion/servicio/DBComando.php");
}