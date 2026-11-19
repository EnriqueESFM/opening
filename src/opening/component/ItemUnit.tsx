import { useDispatch, useSelector } from "react-redux";
import { setUnit } from "../../store";

export const ItemUnit = ({unit,selectedUnit, setDetailUnit,idparent/*:{placa,economico,idGps,nombre,apelldoPaterno,arbolOrganizacion,idLigaUnidad}*/}) => {
  const {selUnit = null} = useSelector( state => (state as any).selUnit);
  const dispatch = useDispatch();
  const click = (/*e*/) =>{
    //console.log(unit);
    const firstSelect = selUnit == null;
    dispatch(setUnit({selUnit: unit}));
    selectedUnit(unit,firstSelect);
  }
  /*const clickDetail = (e) =>{
    setDetailUnit(unit);    
  }*/  
  return (
    <ul className="list-group">
      <li className="list-group-item list-group-item-action list-group-item-primary">
        <div className="row" style={{"cursor":"pointer"}}>
          <div className="col-3 text-primary-emphasis" onClick={click}>{unit.empresa}</div>
          <div className="col-3 text-primary-emphasis" onClick={click}>{unit.placa}</div>
          <div className="col-3 text-primary-emphasis" onClick={click}>{unit.economico}</div>
          <div className="col-2 text-primary-emphasis" onClick={click}>
            <div className="form-check form-switch">
              <input id={`${idparent}_${unit.idunit}`} className="form-check-input CHECK_ITEM" type="checkbox" role="switch" defaultChecked/>            
            </div>
          </div>
        </div>        
      </li>
    </ul>
  )
}
