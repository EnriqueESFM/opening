export const ItemTable = ({row,/*selected,idparent*/}) => {
    const click = ()=>{

    }
  return (
        <div className="row bg-success-subtle border border-success" style={{"cursor":"pointer"}}>                    
            <div className="col-1 text-primary-emphasis" onClick={click}>{row.placa}</div>
            <div className="col-1 text-primary-emphasis">{row.economico}</div>
            <div className="col-1 text-primary-emphasis">{row.entrada}</div>
            <div className="col-1 text-primary-emphasis">{row.salida}</div>
            <div className="col-1 text-primary-emphasis">{row.lugar}</div>
            <div className="col-2 text-primary-emphasis" onClick={click}>                
            </div>
            <div className="col-1 text-success-emphasis"></div>
        </div>        
  )
}
