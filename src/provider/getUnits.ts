import { DBTransaction } from "../helpers";

export const getUnitsByFilter = (idUser,filter,fResponse,fWait) => {
    const DB = new DBTransaction();
    DB.ejecutarSentenciaAsincrono("","","","",1834,`${idUser},1|${filter}|${filter}|${filter}|${filter}|${filter}|${filter}|${filter}|${filter}|${filter}`,"",
    fResponse,null,fWait,"https://www.poderonline.net/paginas/skymeduza2/aplicacion/servicio/DBComando.php");
}

export const getUnitsByFilterAsync = (idUser,filter) => {
    const DB = new DBTransaction();
    return DB.ejecutarAsincrono("","","","",2636,`${idUser},1|${filter}|${filter}|${filter}|${filter}|${filter}|${filter}|${filter}|${filter}|${filter}`,"","https://www.poderonline.net/paginas/skymeduza2/aplicacion/servicio/DBComando_test.php");
}

export const getUnitsByIds = (idUser,ids,fResponse,fWait) => {
    const DB = new DBTransaction();
    DB.ejecutarSentenciaAsincrono("","","","",1937,`${idUser},1|'${ids.replaceAll(",","','")}'`,"",
    fResponse,null,fWait,"https://www.poderonline.net/paginas/skymeduza2/aplicacion/servicio/DBComando.php");
}

export const getUnitsByGroup = (idUser,group,fResponse,fWait) => {
    const DB = new DBTransaction();
    DB.ejecutarSentenciaAsincrono("","","","",2634,`${idUser},1|${group}`,"",
    fResponse,null,fWait,"https://www.poderonline.net/paginas/skymeduza2/aplicacion/servicio/DBComando.php");
}

export const getGroupUnitAsync = (idUser) => {
    const DB = new DBTransaction();
    return DB.ejecutarAsincrono("","","","",2669,`${idUser},1|${idUser},1`,"","https://www.poderonline.net/paginas/skymeduza2/aplicacion/servicio/DBComando.php");
}