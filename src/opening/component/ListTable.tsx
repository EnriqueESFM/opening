import { ItemTable } from "./ItemTable"

export const ListTable = ({rows = [], ref/*,selected,idparent*/}) => {
  const click = (e) =>{
      
    }
  return (
    <div ref={ref}>
      <div className="row bg-primary-subtle border primary-success">                    
            <div className="col-1 text-primary-emphasis" onClick={click}>Placa</div>
            <div className="col-1 text-primary-emphasis">Economico</div>
            <div className="col-1 text-primary-emphasis">Entrada</div>
            <div className="col-1 text-primary-emphasis">Salida</div>
            <div className="col-1 text-primary-emphasis">Lugar</div>
            <div className="col-2 text-primary-emphasis">                
            </div>
            <div className="col-1 text-success-emphasis"></div>
          </div>
      {                    
        rows.map((r,i) =>  (
          <ItemTable key ={(r as any).id} row={r} /*selected={selected} idparent={idparent}*/ />      
        ))
    }
    </div>
  )
}