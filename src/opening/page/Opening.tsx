import { Map } from "../../ui/components/Map";
//import {  APIProvider, useMap,Map, type MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react"
import { Button, Toast, ToastContainer } from "react-bootstrap"
import { FcCheckmark, FcProcess, FcSearch } from "react-icons/fc"
import { FAB, LoadGif } from "../../ui/components"
import { ModalPoint, ModalSideEvent, ModalSideNotes, ModalSideUnit, ModalStop, PoiMarkers, type Poi } from "../component"
import { useForm } from "../../hooks"
import { filterUnit, getLastRequest, getOpening, getTypeStay, getUserAsync } from "../../provider"
import { useDispatch, useSelector } from "react-redux"
import { setOpening, setTypeStay, setUnit, setUnits, startLoadingOpening } from "../../store";
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
//import DT from 'datatables.net-dt';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import '../../helpers/ExtendDate';
import { DateTime } from "../../helpers/DateTime"
import { FaCheck, FaHistory } from "react-icons/fa"
import { IoMdPin } from "react-icons/io"
import {GlobalString} from '../../helpers/GlobalString';
import { setDataUser } from "../../store/slice/userSlide"
import { RxCross2 } from "react-icons/rx"
import { PiWarningDiamondFill } from "react-icons/pi"
import gifLoad from '../../assets/loading3.gif';
import { ImList } from "react-icons/im";
import ReactDOM from 'react-dom/client'
import { BsFileEarmarkExcelFill } from "react-icons/bs";
import { ExcelPopulate } from "../../helpers/ExcelPopulate";
import {default as XlsxPopulate}  from 'xlsx-populate';
import { GrPrevious } from "react-icons/gr";
import { TfiControlBackward } from "react-icons/tfi";

interface StateToast{
    show:boolean,
    msg?:string,
    bg?:string
}
const columnOpening = [
                        {data:'placa'},
                        {data:'economico'}
                    ];
const dataTableOpening = {
                                                language:{
                                                            search:"Buscar",
                                                            info:"Mostrando _START_ a _END_ de _TOTAL_ registros",
                                                            /*paginate: {
                                                                first: "Primero",
                                                                previous: "Anterior",
                                                                next: "Siguiente",
                                                                last: "Ultimo"
                                                            }*/
                                                           lengthMenu: "Mostrar _MENU_ registros",
                                                           emptyTable: "Ningun registro que mostrar",
                                                           infoEmpty: "Mostrando 0 a 0 de 0 registrtos",
                                                           loadingRecords: "Cargando registros...",
                                                           zeroRecords: "Ningun registro coincidente encontrado",
                                                           processing: "Procesando...",                                                          
                                                        },
                                                pageLength:5,
                                                lengthMenu: [5, 10, 25, 50, 100]
                                            };
const notesList = [
    {id:0, color: "blue", descripcion: "Apertura estancia"},
    {id:1, color: "#7405FD", descripcion: "Punto cercano autorizado"},
    {id:2, color: "#F841E5", descripcion: "Punto cercano no autorizado"},
    {id:3, color: "#01A71C", descripcion: "Llega y sale cerrado"},
    {id:4, color: "#C8CF02", descripcion: "Llega abierto sale cerrado"},
    {id:5, color: "#F01802", descripcion: "Se va abierto"},
];



export const Opening = () => {
    DataTable.use(DT);
    const dispatch = useDispatch();
    const dataTableSlots = {
                                    0:(data, row) => <div onClick={()=>{
                                        putAllPositionsOnMap(row);
                                    }} className="LINK">{row.placa}</div>,
                                    1:(data, row) => <div onClick={()=>{
                                        putAllPositionsOnMap(row);
                                    }} className="LINK">{row.economico}</div>,
                                    2:(data, row) => <>{row.entrada.replace("T"," ").replace(".000Z","")}</>,
                                    3:(data, row) => <>{row.salida.replace("T"," ").replace(".000Z","")}</>,
                                    4:(data, row) => <>{DateTime.secondsToTime(row.estancia)}</>,
                                    5:(data, row) => <>{row.temperatura.length == 0 ? "" : (`${row.temperatura[0].dato17/10} / ${row.temperatura[0].dato19/10} / ${row.temperatura[0].dato20/10} °C`)}</>,
                                    6:(data, row) => <>{row.temperatura.length == 0 ? "" : (`${row.temperatura[row.temperatura.length-1].dato17/10} / ${row.temperatura[row.temperatura.length-1].dato19/10} / ${row.temperatura[row.temperatura.length-1].dato20/10} °C`)}</>,
                                    7:(data, row) => <>{row.lugar}</>,
                                    8:(data, row) => <>{row.punto == null ? "" : row.punto.tipo}</>,
                                    9:(data, row) => <><Button variant="outline-primary" onClick={()=>{
                                                            setPointsClose(row.puntoCercano);
                                                            if(row.puntoCercano.length > 0)
                                                                handdlerClosePoint();
                                                            else
                                                                setStateToast({show:true,msg:"Ningun punto cercano",bg:"warning"});
                                                            console.log(row);
                                                        }} title="Lista Puntos">
                                                            {row.puntoCercano.length}
                                                        </Button>
                                                        <Button variant="outline-primary" onClick={()=>{                                                            
                                                            if(row.puntoCercano.length>0){
                                                                const idsPoint = `,${row.asignacion.map(a => a.punto).join()},`;
                                                                putPositionsOnMap(row.puntoCercano,"close-point", null, (p)=>{
                                                                    return idsPoint.includes(`,${p.id},`) ? "#7405FD" : "#F841E5";
                                                                }, getPopupPoint);
                                                            }else
                                                                setStateToast({show:true,msg:"Ningun punto cercano",bg:"warning"});                                                                                                                                
                                                            //console.log(row);
                                                        }} title="Mostrar Puntos" className="m-3">
                                                            <IoMdPin/>
                                                        </Button>
                                                        </>,
                                    10: (data, row) => {
                                                        const curEventsV = row.eventos.filter(e => e.tipo == "valvula");
                                                        const curEventsV2 = row.eventos.filter(e => e.tipo == "valvula2");
                                                        const curEventsVL = row.eventos.filter(e => e.tipo == "valvula puerta lateral");
                                                        if(curEventsV.length == 0 && curEventsV2.length == 0 && curEventsVL.length == 0)
                                                            return <></>;
                                                        let strCodeV = "", colorV = "", strCodeV2 = "", colorV2 = "", strCodeVL = "", colorVL = "";
                                                        if(curEventsV.length >0){
                                                            strCodeV = curEventsV.length == 1 ? `${curEventsV[0].codigo},${curEventsV[0].codigo}` : `${curEventsV[0].codigo},${curEventsV.at(-1).codigo}`;
                                                            colorV = defineColor(strCodeV,curEventsV.map(e => e.codigo).join());
                                                        }
                                                        if(curEventsV2.length >0){
                                                            strCodeV2 = curEventsV2.length == 1 ? `${curEventsV2[0].codigo},${curEventsV2[0].codigo}` : `${curEventsV2[0].codigo},${curEventsV2.at(-1).codigo}`;
                                                            colorV2 = defineColor(strCodeV2,curEventsV2.map(e => e.codigo).join());
                                                        }
                                                        if(curEventsVL.length >0){
                                                            strCodeVL = curEventsVL.length == 1 ? `${curEventsVL[0].codigo},${curEventsVL[0].codigo}` : `${curEventsVL[0].codigo},${curEventsVL.at(-1).codigo}`;
                                                            colorVL = defineColor(strCodeVL,curEventsVL.map(e => e.codigo).join());
                                                        }                                                        
                                                        return <>
                                                                {
                                                                    curEventsV.length > 0 && <>
                                                                        <Button variant="outline-primary" onClick={()=>{
                                                                            setEventList(curEventsV);
                                                                            setSelRowOpening(row);
                                                                            if(curEventsV.length > 0)
                                                                                ($("#eventsList") as any).modal("show");
                                                                            else
                                                                                setStateToast({show:true,msg:"Ningun evento encontrado",bg:"warning"});
                                                                        }} title="Lista valvula">
                                                                            {curEventsV.length}
                                                                        </Button>
                                                                        <Button style={{backgroundColor:`#${colorV}`}} onClick={()=>{
                                                                            if(curEventsV.length>0){                                                                                
                                                                                putPositionsOnMap(curEventsV,"valvula", null, p => {
                                                                                    return `#${colorV}`;
                                                                                }, getPopupValvula);
                                                                            }else
                                                                                setStateToast({show:true,msg:"Ningun punto de valvula",bg:"warning"});
                                                                        }} title="Mostrar valvula" className="m-3">
                                                                            <IoMdPin/>
                                                                        </Button>
                                                                    </>
                                                                }
                                                                {
                                                                    curEventsV2.length > 0 && <>
                                                                        <Button variant="outline-primary" onClick={()=>{                                                                    
                                                                            setEventList(curEventsV2);
                                                                            setSelRowOpening(row);
                                                                            if(curEventsV2.length > 0)
                                                                                ($("#eventsList") as any).modal("show");
                                                                            else
                                                                                setStateToast({show:true,msg:"Ningun evento encontrado",bg:"warning"});
                                                                        }} title="Lista valvula 2">
                                                                            {curEventsV2.length}
                                                                        </Button>
                                                                        <Button style={{backgroundColor:`#${colorV2}`}} onClick={()=>{
                                                                            if(curEventsV2.length>0){                                                                                
                                                                                putPositionsOnMap(curEventsV2,"valvula2", null, p => {
                                                                                    return `#${colorV2}`;
                                                                                }, getPopupValvula);
                                                                            }else
                                                                                setStateToast({show:true,msg:"Ningun punto de valvula2",bg:"warning"});
                                                                        }} title="Mostrar valvula 2" className="m-3">
                                                                            <IoMdPin/>
                                                                        </Button>
                                                                    </>
                                                                }
                                                                {
                                                                    curEventsVL.length > 0 && <>
                                                                        <Button variant="outline-primary" onClick={()=>{                                                                    
                                                                            setEventList(curEventsVL);
                                                                            setSelRowOpening(row);
                                                                            if(curEventsVL.length > 0)
                                                                                ($("#eventsList") as any).modal("show");
                                                                            else
                                                                                setStateToast({show:true,msg:"Ningun evento encontrado",bg:"warning"});
                                                                        }} title="Lista valvula lateral">
                                                                            {curEventsVL.length}
                                                                        </Button>
                                                                        <Button style={{backgroundColor:`#${colorVL}`}} onClick={()=>{
                                                                            if(curEventsVL.length>0){                                                                                
                                                                                putPositionsOnMap(curEventsVL,"valvulaL", null, p => {
                                                                                    return `#${colorVL}`;
                                                                                }, getPopupValvula);
                                                                            }else
                                                                                setStateToast({show:true,msg:"Ningun punto de valvula lateral",bg:"warning"});
                                                                        }} title="Mostrar valvula lateral" className="m-3">
                                                                            <IoMdPin/>
                                                                        </Button>
                                                                    </>
                                                                }
                                                        </>;
                                    },
                                    11: (data, row) => {
                                                            const curEvents = row.eventos.filter(e => e.tipo == "escotilla");
                                                            if(curEvents.length == 0)
                                                                return <></>;
                                                            const strCode = curEvents.length == 1 ? `${curEvents[0].codigo},${curEvents[0].codigo}` : `${curEvents[0].codigo},${curEvents.at(-1).codigo}`;
                                                            const color = defineColor(strCode,curEvents.map(e => e.codigo).join());
                                                            return <><Button variant="outline-primary" onClick={()=>{                                                                    
                                                                        setEventList(curEvents);
                                                                        setSelRowOpening(row);
                                                                        if(curEvents.length > 0)
                                                                            ($("#eventsList") as any).modal("show");
                                                                        else
                                                                            setStateToast({show:true,msg:"Ningun evento encontrado",bg:"warning"});
                                                                    }} title="Lista escotilla">
                                                                        {curEvents.length}
                                                                    </Button>
                                                                    <Button style={{backgroundColor:`#${color}`}} onClick={()=>{
                                                                        if(curEvents.length>0){                                                                                
                                                                            putPositionsOnMap(curEvents,"escotilla", null, p => {
                                                                                return `#${color}`;
                                                                            }, getPopupValvula);
                                                                        }else
                                                                            setStateToast({show:true,msg:"Ningun punto de escotilla",bg:"warning"});
                                                                    }} title="Mostrar escotilla" className="m-3">
                                                                        <IoMdPin/>
                                                                    </Button>
                                                            </>;
                                                        },
                                    12: (data, row) => {
                                                            const curEvents = row.eventos.filter(e => e.tipo == "escotilla2");
                                                            if(curEvents.length == 0)
                                                                return <></>;
                                                            const strCode = curEvents.length == 1 ? `${curEvents[0].codigo},${curEvents[0].codigo}` : `${curEvents[0].codigo},${curEvents.at(-1).codigo}`;
                                                            const color = defineColor(strCode,curEvents.map(e => e.codigo).join());
                                                            return <><Button variant="outline-primary" onClick={()=>{                                                                    
                                                                        setEventList(curEvents);
                                                                        setSelRowOpening(row);
                                                                        if(curEvents.length > 0)
                                                                            ($("#eventsList") as any).modal("show");
                                                                        else
                                                                            setStateToast({show:true,msg:"Ningun evento encontrado",bg:"warning"});
                                                                    }} title="Lista escotilla2">
                                                                        {curEvents.length}
                                                                    </Button>
                                                                    <Button style={{backgroundColor:`#${color}`}} onClick={()=>{
                                                                        if(curEvents.length>0){                                                                                
                                                                            putPositionsOnMap(curEvents,"escotilla2", null, p => {
                                                                                return `#${color}`;
                                                                            }, getPopupValvula);
                                                                        }else
                                                                            setStateToast({show:true,msg:"Ningun punto de escotilla2",bg:"warning"});
                                                                    }} title="Mostrar escotilla2" className="m-3">
                                                                        <IoMdPin/>
                                                                    </Button>
                                                            </>;
                                                        },
                                    13: (data, row) => {
                                                            const curEvents1 = row.eventos.filter(e => e.tipo == "escotilla");
                                                            const strCode1 = curEvents1.length == 0 ? "" : (curEvents1.length == 1 ? `${curEvents1[0].codigo},${curEvents1[0].codigo}` : `${curEvents1[0].codigo},${curEvents1.at(-1).codigo}`);
                                                            const color1 = strCode1 == "" ? "C8CF02" : defineColor(strCode1,curEvents1.map(e => e.codigo).join());
                                                            const curEvents2 = row.eventos.filter(e => e.tipo == "escotilla2");
                                                            const strCode2 = curEvents2.length == 0 ? "" : (curEvents2.length == 1 ? `${curEvents2[0].codigo},${curEvents2[0].codigo}` : `${curEvents2[0].codigo},${curEvents2.at(-1).codigo}`);
                                                            const color2 = strCode2 == "" ? "C8CF02" : defineColor(strCode2,curEvents2.map(e => e.codigo).join());
                                                            const colorIconoConfirm=(curEvents1.length == 0 && curEvents2.length > 0) || (curEvents2.length == 0 && curEvents1.length > 0) ? "F01802"/*rojo*/ : (color1 == color2 ? "01A71C"/*verde*/ : "C8CF02"/*amarillo*/);
                                                            return <>
                                                                        <Button style={{backgroundColor:`#${colorIconoConfirm}`}} onClick={()=>{
                                                                            console.log(row);
                                                                        }} title="Confirmacion" className="m-3">
                                                                            {colorIconoConfirm == "01A71C" /*verde */ ?
                                                                                <FaCheck/>
                                                                            : (
                                                                                colorIconoConfirm == "F01802" /*Rojo */ ?
                                                                                    <RxCross2/>
                                                                                :
                                                                                    <PiWarningDiamondFill />
                                                                            )}
                                                                        </Button>                                                                    
                                                            </>;
                                                        }
                                }
    const { dataUser = null } = useSelector( state => (state as any).dataUser);
    const { typeStay = []} = useSelector( state => (state as any).typeStay);
    const { isLoading: isLoadingOpening = false,opening = []} = useSelector( state => (state as any).opening);
    const { units } = useSelector( state => (state as any).units);
    const listUnitRef = useRef(null);
    const listTypeStayRef = useRef(null);    
    const mapRef = useRef(null);
    const [centerMap, setcenterMap] = useState({ lat: -33.860664, lng: 151.208138 });
    const [zoomMap, setZoomMap] = useState(14)
    const [locations , setLocation] = useState<Poi[]>([]);
    const [closePointLocation , setclosePointLocation] = useState<Poi[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selUnits, setSelUnits] = useState([]);
    const [stateToast, setStateToast] = useState<StateToast>({
        show:false,
        msg:"",
        bg:"success"
    });
    const [selTypeStay, setSelTypeStay] = useState([]);
    const [pointsClose, setPointsClose] = useState([]);
    const [eventList, setEventList] = useState([]);
    const [selRowOpening, setSelRowOpening] = useState(null);
    const curDate = new Date();
    const {start,finish,time,stay,setFormState, onInputChange} = (useForm({
        start:curDate.format("yyyy-mm-dd")+" 00:00:00",
        finish:(new Date() as any).format("yyyy-mm-dd")+" 23:59:59",
        time:1,
        stay:false
    }) as any);
    
    const lastRequestTools = [
            { label: "Ultimo", icon: <GrPrevious />, onClick: (e)=>{
                setIsLoading(true);
                (async () => {
                    const lastData = await getLastRequest();
                    if(lastData.statusCode == 200){
                        if(lastData.last.length == 0)
                            setStateToast({show:true,msg:"No se encontro peticion previa",bg:"warning"});
                        else{
                            setFormState({start:lastData.last[0].inicio,finish:lastData.last[0].fin,time:lastData.last[0].tiempo,stay:lastData.last[0].estancia});
                            let response = await filterUnit(lastData.last[0].unidad.join());
                            if(response.statusCode == 200){
                               dispatch(setUnits({units: response.unit}));
                               setSelUnits(response.unit);                               
                            }
                            response = await getOpening(lastData.last[0].unidad,lastData.last[0].inicio,lastData.last[0].fin,typeof lastData.last[0].tiempo == "undefined" ? 1 : lastData.last[0].tiempo*1 ,typeof lastData.last[0].estancia == "undefined" ? false : lastData.last[0].estancia,typeof lastData.last[0].paradero == "undefined" ? [] : lastData.last[0].paradero);
                            if(response.statusCode == 200){
                                dispatch(setOpening({opening:response.opening,type:response.type}))
                            }
                        }
                    }
                    setIsLoading(false);
                })();
            }},
            { label: "Penultimo", icon: <TfiControlBackward />, onClick: (e)=>{
                setIsLoading(true);
                (async () => {
                    const lastData = await getLastRequest();
                    if(lastData.statusCode == 200){
                        if(lastData.last.length == 0)
                            setStateToast({show:true,msg:"No se encontro peticion previa",bg:"warning"});
                        else{                            
                            const idx = lastData.last.length > 1 ? lastData.last.length -2 : lastData.last.length -1;
                            setFormState({start:lastData.last[idx].inicio,finish:lastData.last[idx].fin,time:lastData.last[idx].tiempo,stay:lastData.last[idx].estancia});
                            let response = await filterUnit(lastData.last[idx].unidad.join());
                            if(response.statusCode == 200){
                               dispatch(setUnits({units: response.unit}));
                               setSelUnits(response.unit);                               
                            }
                            response = await getOpening(lastData.last[idx].unidad,lastData.last[idx].inicio,lastData.last[idx].fin,typeof lastData.last[idx].tiempo == "undefined" ? 1 : lastData.last[idx].tiempo*1 ,typeof lastData.last[idx].estancia == "undefined" ? false : lastData.last[idx].estancia,typeof lastData.last[idx].paradero == "undefined" ? [] : lastData.last[idx].paradero);
                            if(response.statusCode == 200){
                                dispatch(setOpening({opening:response.opening,type:response.type}))
                            }
                        }
                    }
                    setIsLoading(false);
                })();
            }}     
            ]
    
    const putMarkers : ()=> void = ()=>{
        setLocation([
            {key: 'operaHouse', location: { lat: -33.8567844, lng: 151.213108  }},
            {key: 'tarongaZoo', location: { lat: -33.8472767, lng: 151.2188164 }},
            {key: 'manlyBeach', location: { lat: -33.8209738, lng: 151.2563253 }},
            {key: 'hyderPark', location: { lat: -33.8690081, lng: 151.2052393 }},
            {key: 'theRocks', location: { lat: -33.8587568, lng: 151.2058246 }},
            {key: 'circularQuay', location: { lat: -33.858761, lng: 151.2055688 }},
            {key: 'harbourBridge', location: { lat: -33.852228, lng: 151.2038374 }},
            {key: 'kingsCross', location: { lat: -33.8737375, lng: 151.222569 }},
            {key: 'botanicGardens', location: { lat: -33.864167, lng: 151.216387 }},
            {key: 'museumOfSydney', location: { lat: -33.8636005, lng: 151.2092542 }},
            {key: 'maritimeMuseum', location: { lat: -33.869395, lng: 151.198648 }},
            {key: 'kingStreetWharf', location: { lat: -33.8665445, lng: 151.1989808 }},
            {key: 'aquarium', location: { lat: -33.869627, lng: 151.202146 }},
            {key: 'darlingHarbour', location: { lat: -33.87488, lng: 151.1987113 }},
            {key: 'barangaroo', location: { lat: - 33.8605523, lng: 151.1972205 }},
        ]);
    }

    const defineColor = (codigo,codeStr) => {
        //alert(codigo)
        var cod=codigo.replace(",,","");
        switch(cod){
            //se va de estancia abierta
            case "20":
            case "202":
            case "605":
            case "606":
            case "undefined,202":
            case "undefined,20":
            case "undefined,605":
            case "undefined,606":
            case "201,202":
            case "21,20":
            case "604,605":
            case "607,606":
            case "202,202":
            case "20,20":
            case "605,605":
            case "606,606":
                return "F01802";/*rojo*/
                break;
            //se va cerrada
            case "202,201":
            case "20,21":
            case "605,604":
            case "606,607":
                return "C8CF02";//amarillo
                break;
            case "21":
            case "201":
            case "604":
            case "607":
            case "undefined,201":
            case "undefined,21":
            case "undefined,604":
            case "undefined,607":
                return "01A71C";//verde
                break;
            default:
                switch(cod){
                    case "201,201":
                    case "21,21":
                    case "604,604":
                    case "607,607":
                        if(codeStr.includes(",202,") || codeStr.includes(",20,") || codeStr.includes(",605,") || codeStr.includes(",606,"))
                            return "01A71C";//verde
                        else
                            return "FAC45D";//naranja
                        break;
                    default:
                        return "FAC45D";//naranja
                        break;

                }
                break;
        }
    }
    const init = () => {
        (async() =>{
            setIsLoading(true);
            let response = await getUserAsync(GlobalString.user,GlobalString.idaplication);
            if(typeof response != "undefined"){
                if(response.rows.length > 0){
                    dispatch(setDataUser({dataUser:response.rows[0]}))
                }
                const response1 = await getTypeStay();
                if(response1.statusCode == 200){
                    dispatch(setTypeStay({typeStay:response1.type}))
                }
            }
            setIsLoading(false);
        })();              
    }
    const getPopupPoint = (p,color) => {
                                    return $(`<div style = 'min-height:90px; min-width:120px; ${color == null ? '' : `background-color:${color}`}'>
                                                <div class='col-12'>
                                                    <div class='row'>
                                                        <div class='col-3' style = "color: white; font-weight : bold">
                                                            Nombre:
                                                        </div>
                                                        <div class='col-9' style = "color: white;">
                                                            ${p.descripcion}
                                                        </div>
                                                    </div>
                                                    <div class='row'>
                                                        <div class='col-3' style = "color: white; font-weight : bold">
                                                            Tipo:
                                                        </div>
                                                        <div class='col-9' style = "color: white;">
                                                            ${p.tipo}
                                                        </div>
                                                    </div>                        
                                                    <div class='row'>
                                                        <div class='col-3' style = "color: white; font-weight : bold">
                                                            Radio:
                                                        </div>
                                                        <div class='col-9' style = "color: white;">
                                                            ${p.radio}
                                                        </div>
                                                    </div>
                                                    <div class='row'>
                                                        <div class='col-3' style = "color: white; font-weight : bold">
                                                            Dist:
                                                        </div>
                                                        <div class='col-9' style = "color: white;">
                                                            ${Math.floor(p.distancia*100)/100}
                                                        </div>
                                                    </div>
                                                    <div class='row'>
                                                        <div class='col-3' style = "color: white; font-weight : bold">
                                                            Grupo:
                                                        </div>
                                                        <div class='col-9' style = "color: white;">
                                                            ${p.grupo}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>`)[0]
                                }
    const getPopupValvula = (p,color) => {
                                    return $(`<div style = 'min-height:90px; min-width:120px; ${color == null ? '' : `background-color:${color}`}'>
                                                <div class='col-12'>
                                                    <div class='row'>
                                                        <div class='col-3' style = "color: white; font-weight : bold">
                                                            Tipo:
                                                        </div>
                                                        <div class='col-9' style = "color: white;">
                                                            ${p.tipo}
                                                        </div>
                                                    </div>
                                                    <div class='row'>
                                                        <div class='col-3' style = "color: white; font-weight : bold">
                                                            Fecha hora:
                                                        </div>
                                                        <div class='col-9' style = "color: white;">
                                                            ${p.fechaHora.replace("T", " ").replace(".000Z","")}
                                                        </div>
                                                    </div>                        
                                                    <div class='row'>
                                                        <div class='col-3' style = "color: white; font-weight : bold">
                                                            Evento:
                                                        </div>
                                                        <div class='col-9' style = "color: white;">
                                                            ${p.evento}
                                                        </div>
                                                    </div>
                                                    <div class='row'>
                                                        <div class='col-3' style = "color: white; font-weight : bold">
                                                            Sat:
                                                        </div>
                                                        <div class='col-9' style = "color: white;">
                                                            ${p.satelites}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>`)[0]
                                }
    const getPopupStay = (p,color) => {
                                    return $(`<div style = 'min-height:90px; min-width:120px; ${color == null ? '' : `background-color:${color}`}'>
                                                <div class='col-12'>
                                                    <div class='row'>
                                                        <div class='col-3' style = "color: white; font-weight : bold">
                                                            Placa:
                                                        </div>
                                                        <div class='col-9' style = "color: white;">
                                                            ${p.placa}
                                                        </div>
                                                    </div>
                                                    <div class='row'>
                                                        <div class='col-3' style = "color: white; font-weight : bold">
                                                            Lugar:
                                                        </div>
                                                        <div class='col-9' style = "color: white;">
                                                            ${p.lugar}
                                                        </div>
                                                    </div>                        
                                                    <div class='row'>
                                                        <div class='col-3' style = "color: white; font-weight : bold">
                                                            Entrada:
                                                        </div>
                                                        <div class='col-9' style = "color: white;">
                                                            ${p.entrada.replace("T", " ").replace(".000Z","")}
                                                        </div>
                                                    </div>
                                                    <div class='row'>
                                                        <div class='col-3' style = "color: white; font-weight : bold">
                                                            Salida:
                                                        </div>
                                                        <div class='col-9' style = "color: white;">
                                                            ${p.salida.replace("T", " ").replace(".000Z","")}
                                                        </div>
                                                    </div>
                                                    <div class='row'>
                                                        <div class='col-3' style = "color: white; font-weight : bold">
                                                            Salida:
                                                        </div>
                                                        <div class='col-9' style = "color: white;">
                                                            ${DateTime.secondsToTime(p.estancia)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>`)[0]
                                }

    const getReport = function(){
        const selectedUnits = getCheckUnits();
        if(selectedUnits.length == 0){
            setStateToast({show:true,msg:"Seleccione alguna unidad",bg:"warning"});
            return;
        }
        if(start > finish){
            setStateToast({show:true,msg:"Rango de tiempo iuncorrecto",bg:"warning"});
            return;
        }
        const selectedTypeStays = getCheckTypeStay();
        (async() =>{
            dispatch(startLoadingOpening());
            const response = await getOpening(selectedUnits.map(u => u.idunit*1),start,finish,time*1,stay,selectedTypeStays);
            if(response.statusCode == 200){
                dispatch(setOpening({opening:response.opening,type:response.type}))
            }            
        })();
    }
    const getExcelReport = () => {
        if(opening.length == 0){
            setStateToast({show:true,msg:"Ninguna informacion que exportar",bg:"warning"});
            return;
        }
        let p = 0;
        XlsxPopulate.fromBlankAsync().then(function (workbook) {
            let r = 1;
            let c = 1;
            setIsLoading(true);
            workbook.sheet(p).name("Aperturas");               
            r = 1;
            workbook.sheet(p).cell("A"+r).value("ID");
            workbook.sheet(p).cell("B"+r).value("Placa");
            workbook.sheet(p).cell("C"+r).value("Economico");
            workbook.sheet(p).cell("D"+r).value("Entrada");
            workbook.sheet(p).cell("E"+r).value("Salida");
            workbook.sheet(p).cell("F"+r).value("Tiempo");
            workbook.sheet(p).cell("G"+r).value("Temp E");
            workbook.sheet(p).cell("H"+r).value("Temp S");
            workbook.sheet(p).cell("I"+r).value("Lugar");
            workbook.sheet(p).cell("J"+r).value("Coordenadas");
            workbook.sheet(p).cell("K"+r).value("Valvula");
            workbook.sheet(p).cell("L"+r).value("Valvula2");
            workbook.sheet(p).cell("M"+r).value("ValvulaLateral");
            workbook.sheet(p).cell("N"+r).value("Escotilla1");
            workbook.sheet(p).cell("O"+r).value("Escotilla2");
            workbook.sheet(p).cell("P"+r).value("LINK");                
            workbook.sheet(p).range("A"+r+":P"+r).style({"fontColor":"ffffff","fill":"0A79A2","fontSize":14});
            opening.forEach(d => {
                r++;
                workbook.sheet(p).cell("A"+r).value(r-1);
                workbook.sheet(p).cell("B"+r).value(d.placa);
                workbook.sheet(p).cell("C"+r).value(d.econmico);
                workbook.sheet(p).cell("D"+r).value(d.entrada);
                workbook.sheet(p).cell("E"+r).value(d.salida);
                workbook.sheet(p).cell("F"+r).value(DateTime.secondsToTime(d.estancia));
                workbook.sheet(p).cell("G"+r).value(d.temperatura.length == 0 ? "" : (`${d.temperatura[0].dato17/10} / ${d.temperatura[0].dato19/10} / ${d.temperatura[0].dato20/10} °C`));
                workbook.sheet(p).cell("H"+r).value(d.temperatura.length == 0 ? "" : (`${d.temperatura.at(-1).dato17/10} / ${d.temperatura.at(-1).dato19/10} / ${d.temperatura.at(-1).dato20/10} °C`));
                workbook.sheet(p).cell("I"+r).value(d.lugar);
                workbook.sheet(p).cell("J"+r).value(`(${d.latitud},${d.longitud})`);
                const curEventsV = d.eventos.filter(e => e.tipo == "valvula");
                const curEventsV2 = d.eventos.filter(e => e.tipo == "valvula2");
                const curEventsVL = d.eventos.filter(e => e.tipo == "valvula puerta lateral");                
                let strCodeV = "", colorV = "", strCodeV2 = "", colorV2 = "", strCodeVL = "", colorVL = "";
                if(curEventsV.length >0){
                    strCodeV = curEventsV.length == 1 ? `${curEventsV[0].codigo},${curEventsV[0].codigo}` : `${curEventsV[0].codigo},${curEventsV.at(-1).codigo}`;
                    colorV = defineColor(strCodeV,curEventsV.map(e => e.codigo).join());
                    workbook.sheet(p).cell("K"+r).style({ fill: colorV, underline: true });
                }
                if(curEventsV2.length >0){
                    strCodeV2 = curEventsV2.length == 1 ? `${curEventsV2[0].codigo},${curEventsV2[0].codigo}` : `${curEventsV2[0].codigo},${curEventsV2.at(-1).codigo}`;
                    colorV2 = defineColor(strCodeV2,curEventsV2.map(e => e.codigo).join());
                    workbook.sheet(p).cell("L"+r).style({ fill: colorV2, underline: true });
                }
                if(curEventsVL.length >0){
                    strCodeVL = curEventsVL.length == 1 ? `${curEventsVL[0].codigo},${curEventsVL[0].codigo}` : `${curEventsVL[0].codigo},${curEventsVL.at(-1).codigo}`;
                    colorVL = defineColor(strCodeVL,curEventsVL.map(e => e.codigo).join());
                    workbook.sheet(p).cell("M"+r).style({ fill: colorVL, underline: true });
                }
                let curEvents = d.eventos.filter(e => e.tipo == "escotilla");
                if(curEvents.length > 0){                
                    let strCode = curEvents.length == 1 ? `${curEvents[0].codigo},${curEvents[0].codigo}` : `${curEvents[0].codigo},${curEvents.at(-1).codigo}`;
                    let color = defineColor(strCode,curEvents.map(e => e.codigo).join());
                    workbook.sheet(p).cell("N"+r).style({ fill: color, underline: true });
                }                
                curEvents = d.eventos.filter(e => e.tipo == "escotilla2");                
                if(curEvents.length > 0){
                    let strCode = curEvents.length == 1 ? `${curEvents[0].codigo},${curEvents[0].codigo}` : `${curEvents[0].codigo},${curEvents.at(-1).codigo}`;
                    let color = defineColor(strCode,curEvents.map(e => e.codigo).join());
                    workbook.sheet(p).cell("O"+r).style({ fill: color, underline: true });                
                }
                workbook.sheet(p).cell("P"+r).value("Link")
                                                .style({ fontColor: "0563c1", underline: true })
                                                .hyperlink("http://maps.google.com/maps?q=" + (d. latitud/ 100000) + "," + (d.longitud / 100000) + "&z=15&t=k");                                    
            });
            for (let i = 0; i < 15; i++)
                workbook.sheet(p).column(ExcelPopulate.stringFromColumnIndex(i)).width(i == 9 ? 50 : 25);
            return workbook.outputAsync().then(function (blob) {
                    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) {
                        // If IE, you must uses a different method.
                        (window.navigator as any).msSaveOrOpenBlob(blob, "InOut"+(new Date).format("yyyymmddHHMMss")+".xlsx");
                    } else {
                        var url = window.URL.createObjectURL(blob);
                        var a = document.createElement("a");
                        document.body.appendChild(a);
                        a.href = url;
                        a.download = "InOut"+(new Date).format("yyyymmddHHMMss")+".xlsx";
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                    }
                    setIsLoading(false);
                }).catch(function (err) {
                        alert(err.message || err);
                        setIsLoading(false);
                        throw err;
                });
        });

    }

    const putPositionsOnMap = (positions: Array<any>, labelPositions : string, getPath : ((a) => string) | null, getColor : (a) => string, getPopup : (a,color) => HTMLElement) => {
        if((mapRef.current as any).isVisibleMarkers(labelPositions)){
            (mapRef.current as any).hideMarkers(labelPositions);
            return;
        }
        let markers = new Array();
        positions.forEach(p => {
            let dataIcon = {
                fillColor: getColor(p),
                strokeColor: "white"
            };
            if(getPath != null)
                (dataIcon as any).path = getPath(p);
            let markerImage = (mapRef.current as any).getIconByColor(dataIcon);            
            markers.push({
                latitude:parseFloat(p.latitud)/100000,
                longitude:parseFloat(p.longitud)/100000,
                label:null,
                description:p.id,
                icon:markerImage,
                message:null,
                popup:getPopup(p,getColor(p)),
                eventElementPopup:[/*{
                                        element:'DELETE',
                                        event:'click',
                                        action:function(e){
                                            parameter.map.removeMarker(this.key,this.index);
                                            markers.splice(this.index,1);
                                            for (var i = this.index; i < markers.length; i++) {
                                                markers[i].label = ""+(i+1);
                                                parameter.map.changeDataMarker("last-position",i,{label:(i+1)});
                                            }
                                            parameter.finishGenerateRoute(markers);
                                            putObjectOnMap(false);
                                        }
                                    },{
                                        element:'MOVE',
                                        event:'click',
                                        action:function(e){
                                            curMark = this;
                                            if(movePoint==null)
                                                movePoint = new MovePoint({idParent:"movePoint",move:move});
                                            movePoint.open({backdrop:false,keyboard:true});

                                            function move(num){
                                                if(!esEntero(num)){
                                                    Global.messageAlert.setText("Debe de escribir un número").open({backdrop:false,keyboard:true});
                                                    return;
                                                }
                                                let pos = num*1 - 1;
                                                if(pos < 0 || pos > markers.length-1){
                                                    Global.messageAlert.setText("Posición fuera de rango").open({backdrop:false,keyboard:true});
                                                    return;
                                                }
                                                if(pos == curMark.index){
                                                    parameter.map.hidePopup(curMark.key,curMark.index);
                                                    movePoint.close();
                                                    return;
                                                }
                                                let minIdx = Math.min(pos,curMark.index)
                                                markers.splice(pos,0,markers[curMark.index]);
                                                if(pos < curMark.index)                                                                                        
                                                    markers.splice(curMark.index+1,1);
                                                else                            
                                                    markers.splice(curMark.index,1);                                                                                    
                                                for (let i = minIdx; i < markers.length; i++)
                                                    markers[i].label = ""+(i+1);                                                                                                                                                                    
                                                parameter.map.hidePopup(curMark.key,curMark.index);                                                                         
                                                parameter.map.addMarkers("last-position",markers,false);
                                                parameter.finishGenerateRoute(markers);
                                                putObjectOnMap(false);
                                                movePoint.close();
                                            }
                                        } 
                                    }*/],
                drag:false,
                functionClick:(e)=>{

                },
                functionDrag:function(position,key,idx){
                    /*markers[idx].latitude = position.latitude/100000;
                    markers[idx].longitude = position.longitude/100000;
                    parameter.finishGenerateRoute(markers);
                    putObjectOnMap(false);*/
                    //parameter.functionDraged.call(this,position,key,idx);
                }
            });            
        });
        (mapRef.current as any).addMarkers(labelPositions,markers);
        (mapRef.current as any).centerMarkers(labelPositions);        
        (mapRef.current as any).setZoom(18);
    }

    const putAllPositionsOnMap = (row) => {
        //Put close points
        if(row.puntoCercano.length>0){
            const idsPoint = `,${row.asignacion.map(a => a.punto).join()},`;
            putPositionsOnMap(row.puntoCercano,"close-point", null, (p)=>{
                return idsPoint.includes(`,${p.id},`) ? "#7405FD" : "#F841E5";
            }, getPopupPoint);
        }

        //Put valvule locations
        const curEventsV = row.eventos.filter(e => e.tipo == "valvula");
        const curEventsV2 = row.eventos.filter(e => e.tipo == "valvula2");
        const curEventsVL = row.eventos.filter(e => e.tipo == "valvula puerta lateral");       
        let strCodeV = "", colorV = "", strCodeV2 = "", colorV2 = "", strCodeVL = "", colorVL = "";
        if(curEventsV.length >0){
            strCodeV = curEventsV.length == 1 ? `${curEventsV[0].codigo},${curEventsV[0].codigo}` : `${curEventsV[0].codigo},${curEventsV.at(-1).codigo}`;
            colorV = defineColor(strCodeV,curEventsV.map(e => e.codigo).join());
        }
        if(curEventsV2.length >0){
            strCodeV2 = curEventsV2.length == 1 ? `${curEventsV2[0].codigo},${curEventsV2[0].codigo}` : `${curEventsV2[0].codigo},${curEventsV2.at(-1).codigo}`;
            colorV2 = defineColor(strCodeV2,curEventsV2.map(e => e.codigo).join());
        }
        if(curEventsVL.length >0){
            strCodeVL = curEventsVL.length == 1 ? `${curEventsVL[0].codigo},${curEventsVL[0].codigo}` : `${curEventsVL[0].codigo},${curEventsVL.at(-1).codigo}`;
            colorVL = defineColor(strCodeVL,curEventsVL.map(e => e.codigo).join());
        }
        if(curEventsV.length>0){                                                                                
            putPositionsOnMap(curEventsV,"valvula", null, p => {
                return `#${colorV}`;
            }, getPopupValvula);
        }
        if(curEventsV2.length>0){                                                                                
            putPositionsOnMap(curEventsV2,"valvula2", null, p => {
                return `#${colorV2}`;
            }, getPopupValvula);
        }
        if(curEventsVL.length>0){                                                                                
            putPositionsOnMap(curEventsVL,"valvulaL", null, p => {
                return `#${colorVL}`;
            }, getPopupValvula);
        }

        // Put escotilla locations
        let curEvents = row.eventos.filter(e => e.tipo == "escotilla");
        if(curEvents.length == 0)
            return <></>;
        let strCode = curEvents.length == 1 ? `${curEvents[0].codigo},${curEvents[0].codigo}` : `${curEvents[0].codigo},${curEvents.at(-1).codigo}`;
        let color = defineColor(strCode,curEvents.map(e => e.codigo).join());
        if(curEvents.length>0){                                                                                
            putPositionsOnMap(curEvents,"escotilla", null, p => {
                return `#${color}`;
            }, getPopupValvula);
        }

        //Put escotilla2 locations
        curEvents = row.eventos.filter(e => e.tipo == "escotilla2");
        if(curEvents.length == 0)
            return <></>;
        strCode = curEvents.length == 1 ? `${curEvents[0].codigo},${curEvents[0].codigo}` : `${curEvents[0].codigo},${curEvents.at(-1).codigo}`;
        color = defineColor(strCode,curEvents.map(e => e.codigo).join());
        if(curEvents.length>0){                                                                                
            putPositionsOnMap(curEvents,"escotilla2", null, p => {
                return `#${color}`;
            }, getPopupValvula);
        }        
        
        //Put stay element
        putPositionsOnMap([row],"stay", null, (p)=>{
                                                        return row.id == -1 ? "#01E4FF"  : "blue";
                                                    }, getPopupStay);
    }



    const selectedUnit = (unit,firstSelect)=>{
        
    }

    const selectedStop = (unit,firstSelect)=>{
        
    }

    const setDetailUnit = (unit) => {

    }

    const closeListUnit = () =>{
        setSelUnits(getCheckUnits());
    }

    const closeListTypestay = () =>{
        setSelTypeStay(getCheckTypeStay());
    }

    const getCheckUnits = () => {
        const ids = $(listUnitRef.current as any).find(".CHECK_ITEM").toArray().filter((chk : HTMLInputElement) => chk.checked).map(chk => parseInt(chk.id.replace("SelUnit_","")));        
        //return ids;
        return units.filter(u => ids.includes(u.idunit));
    }

    const getCheckTypeStay = () => {
        return $(listTypeStayRef.current as any).find(".CHECK_ITEM").toArray().filter((chk : HTMLInputElement) => chk.checked).map(chk => chk.id.replace("SelTypeStay_",""));
    }

    const handdlerSearchUnit = () => {
        setTimeout(() =>  ($("#selectUnits") as any).find(".FILTER")[0].focus(),600);
        ($("#selectUnits") as any).modal("show");
    }
    const handdlerSelectedStop = () => {
        ($("#selectStops") as any).modal("show");
    }

    const handdlerClosePoint = () => {
        ($("#closePoint") as any).modal("show");
    }

    

    const closeListPoints = ()=>{};

    const selectedPoint = () => {};

    const closeListEvent = ()=>{};

    const selectedEvent = () => {};

    useEffect(() => {
      init();
      return () => {
      }
    }, []);

    useEffect(() => {
        setTimeout(() => {
            console.log("sssss");
            $("body").find(".dt-layout-end")[0].appendChild($("<div class = 'MAIN-TOOLS px-3'></div>")[0]);
            try {
                const rootTOOLS = ReactDOM.createRoot($("body").find(".dt-layout-end").find(".MAIN-TOOLS")[0]);       
                rootTOOLS.render(<div className="row">                                
                                <div className="col-sm-12 d-flex">
                                    <div className="ms-auto">
                                        <Button variant="success" onClick={getExcelReport} title="Exportar">
                                            <BsFileEarmarkExcelFill />
                                        </Button>
                                    </div>
                                </div>
                            </div>);   
            } catch (error) {
                
            }            
        }, 1000);
      return () => {
        
      }
    }, [opening]);
    
    useEffect(() => {
      console.log(units);
      return () => {
      }
    }, [units]);
    
  return (
    <>
        <div className="container-fluid" style={{margin:0,padding:0, overflowX:'hidden'}}>              
            <div className="row">
                <div className="col-sm-3 bg-primary-subtle p-2 my-1">
                    {
                        !isLoading &&
                        (<>
                            <div className="mb-1 mx-1 row">
                                <label className="col-sm-3 col-form-label">Unidades</label>
                                <div className="col-sm-4">
                                    {`${selUnits.length} seleccionadas`}
                                </div>
                                <div className="col-sm-5 text-end">
                                    <Button variant="primary" onClick={handdlerSearchUnit} title="Unidades">
                                        <FcSearch className="me-2" />
                                    </Button>
                                </div>
                            </div>
                            <div className="mb-1 mx-1 row">
                                <label className="col-sm-3 col-form-label">Inicio</label>
                                <div className="col-sm-9">
                                    <input type="datetime-local" className="form-control" name="start" value={start} onChange={onInputChange}/>
                                </div>
                            </div>
                            <div className="mb-1 mx-1 row">
                                <label className="col-sm-3 col-form-label">Fin</label>
                                <div className="col-sm-9">
                                    <input type="datetime-local" className="form-control" name="finish" value={finish} onChange={onInputChange}/>
                                </div>
                            </div>
                            <div className="mb-1 mx-1 row">
                                <label className="col-sm-3 col-form-label">T. Estancia</label>
                                <div className="col-sm-9">
                                    <input type="range" className="form-control" name="time" min={0} max={60} value={time} onChange={onInputChange}/>{time} min.
                                </div>
                            </div>
                            <div className="mb-1 mx-1 row">
                                <label className="col-sm-3 col-form-label">Por Estancia</label>
                                <div className="col-sm-9">
                                    <div className="form-check form-switch">
                                        <input className="form-check-input CHECK_ITEM" type="checkbox" role="switch" name="stay" checked = {stay} onChange={onInputChange}/>
                                    </div>
                                </div>                                
                            </div>
                            <div className="mb-1 mx-1 row">
                                <label className="col-sm-3 col-form-label">Paraderos</label>
                                <div className="col-sm-4">
                                    {`${selTypeStay.length} seleccionadas`}
                                </div>
                                <div className="col-sm-5 text-end">
                                    <Button variant="primary" onClick={handdlerSelectedStop} title="Paraderos">
                                        <FcCheckmark className="me-2" />
                                    </Button>
                                </div>
                            </div>                            
                            {/*<div className="mb-3 row">
                                <label className="col-sm-3 col-form-label">Paraderos</label>
                                <div className="col-sm-9">
                                    <select className="form-control">
                                        {typeStay.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>*/}
                            <div className="mb-3 mx-1 row">
                                <div className="col-sm-2 text-right">
                                                                        
                                </div>
                                <div className="col-sm-2 text-right">
                                    <FAB actions={lastRequestTools} Icon={FaHistory} title = "Peticion anterior" position = "absolute"/>                                    
                                </div>                                
                                <div className="col-sm-4 text-center">
                                    <Button variant="primary" onClick={getReport}>
                                        <FcProcess className="me-2" /> Obtener
                                    </Button>
                                </div>
                                <div className="col-sm-4 d-flex">                                    
                                </div>
                            </div>
                        </>)
                    }
                    {
                        isLoading &&
                            <LoadGif msg={"Obteniendo..."} gif={gifLoad}/>
                    }
                </div>                
                <div className="col-sm-9" style={{minHeight:300}}>
                    {/*<APIProvider apiKey={GlobalString.apiKey} onLoad={() => {
                            console.log('Maps API has loaded.');                            
                        }}>
                        <Map                    
                        defaultZoom={15}
                        defaultCenter={ { lat: -33.860664, lng: 151.208138 } }                        
                        onCameraChanged={ (ev: MapCameraChangedEvent) =>{
                            //console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
                            if(mapRef.current == null)
                                mapRef.current = ev.map;
                        }}>
                            <PoiMarkers pois={closePointLocation} />
                        </Map>                        
                    </APIProvider>*/
                    }
                    <Map ref = {elmt => {
                        mapRef.current = elmt;
                    }}/>                    
                </div>
            </div>
            <div className="row">
                <div className="col-sm-12 px-2 mx-2">
                    {
                        isLoadingOpening &&                        
                            <LoadGif msg={"Obteniendo..."} gif={gifLoad}/>                            
                    }
                    {
                        !isLoadingOpening &&
                        <DataTable data = {opening} columns={columnOpening} className="display"
                            slots={dataTableSlots} options={dataTableOpening}>
                            <thead>
                                <tr>
                                    <th>Placa</th>
                                    <th>Economico</th>
                                    <th>Entrada</th>
                                    <th>Salida</th>
                                    <th>Tiempo</th>
                                    <th>Temp E</th>
                                    <th>Temp S</th>
                                    <th>Lugar</th>
                                    <th>Tipo</th>
                                    <th>Cercanos</th>
                                    <th>Valvula</th>
                                    <th>Escotilla 1</th>
                                    <th>Escotilla 2</th>
                                    <th>Confirma</th>
                                </tr>
                            </thead>
                        </DataTable>
                        /*<ListTable rows={opening} idparent={"ListOpening"} columns={[]} ref={listOpeningRef} selected={()=>{}} />*/
                    }
                </div>
            </div>
            {/*<div className="row">
                <div className="col">
                    <Button
                        variant="primary"
                        onClick={putMarkers}>Agregar iconos</Button>
                </div>
            </div>*/}
        </div>
        <FAB actions={[]} Icon={ImList} title = "Acotaciones" position = "fab-top-right" click = {()=>{
            ($("#notesList") as any).modal("show");
        }}/>
        <ModalSideUnit id = "selectUnits" refList={listUnitRef} selectedUnit = {selectedUnit} setDetailUnit = {setDetailUnit} functionClose = {closeListUnit}/>
        <ModalStop id = "selectStops" refList={listTypeStayRef} selectedStop = {selectedStop} functionClose = {closeListTypestay}/>
        <ModalPoint id = "closePoint" list = {pointsClose} selected = {selectedPoint} functionClose = {closeListPoints}/>
        <ModalSideEvent id = "eventsList" list = {eventList} title = {`${selRowOpening == null ? `Eventos`: `Eventos de unidad ${selRowOpening.placa}`}`} selected = {selectedEvent} functionClose = {closeListEvent}/>
        <ModalSideNotes id = "notesList" list = {notesList} title = {`Acotaciones`} selected = {()=>{}} functionClose = {()=>{}}/>
        <ToastContainer position="top-center" className="p-3">
          <Toast onClose={() => setStateToast({show:false})} show={stateToast.show} bg={stateToast.bg} delay={3000} autohide>
            <Toast.Header>
              <strong className="me-auto">Alerta</strong>
              <small>...</small>
            </Toast.Header>
            <Toast.Body>{stateToast.msg}</Toast.Body>
          </Toast>
        </ToastContainer>
      </>
  )
}



