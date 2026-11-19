import { useContext, useEffect, useRef } from "react";
import { getUnits } from "../../store";
import { SpinnerLoad } from "../../ui/components";
import { GlobalContext } from "../../context/context";
import { useForm } from "../../hooks";
import { useDispatch, useSelector } from "react-redux";
import { ListUnit } from "./ListUnit";

export const UnitPanel = ({selectedUnit,setDetailUnit,refList}) => {
  const onSearch = async() => {
        if(searchText.trim().length < 1)
            return;
        dispatch((getUnits(searchText) as any));
    };
    const {searchText, onInputChange} = (useForm({
        searchText:""
    }) as any);
    const dispatch = useDispatch();
    const { isLoading, lastSearch, units } = useSelector( state => (state as any).units);

    const changeAllChecked = (e) => {
        $(refList.current).find(".CHECK_ITEM").toArray().forEach(chk => (chk as HTMLInputElement).checked = e.target.checked);
        //console.log(e.target);
    };

    useEffect(()=>{
        
    },[lastSearch]);
    useEffect(() => {
      console.log(units);
      return () => {
      }
    }, [units]);
  return (
    <>
        <div className="row">
            <div className="col-sm-11">
                <div className="input-group mb-3">
                    <input 
                    type="text"
                    className="form-control FILTER"
                    placeholder="Busqueda"
                    name="searchText"
                    value={searchText}
                    onChange={onInputChange}
                    onKeyDown={e => {if(e.keyCode ==13) onSearch()}}
                    />
                    <span className={`input-group-text fa fa-search btn ${searchText == "" ? "btn-primary" : "btn-success"}` } onClick={onSearch}></span>
                </div>                
            </div>
            <div className="col-sm-1">
                <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" role="switch" onChange={changeAllChecked}/>            
                </div>
            </div>
        </div>
        {isLoading ? <SpinnerLoad msg = "Buscando unidades..."/> : ""}
        {
            !isLoading ?
            <div className="row">
                <div className="col LIST-ITEMS">          
                {
                    units != null ? 
                                    (units.length > 0 ?  
                                                        (units.length == 1 && typeof units[0].error != "undefined" ?
                                                                                                                     <div className="alert alert-danger">{units[0].error}</div> 
                                                                                                                     : <ListUnit idparent={`SelUnit`} ref = {refList} units = {units} selectedUnit = {selectedUnit} setDetailUnit = {setDetailUnit} />
                                                                                                                        ) : <div className="alert alert-warning">No se encontro ninguna unidad que coincida con {searchText}</div>
                                                                                                                            ) : ""
                }
                </div>
            </div>
            :""
        }        
    </>
  )
}
