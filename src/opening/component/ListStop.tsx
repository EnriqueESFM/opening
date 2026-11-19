export const ListStop = ({types = [], ref,selectedStop,idparent}) => {
  /*const getChecked =function(){
    return $(ref.current).find(".CHECK_ITEM").toArray().filter((chk : HTMLInputElement) => chk.checked).map(chk => chk.id.replace("SelTypeStay_",""));       
  }*/
  const click = (e) =>{
      
    }
  return (
    <div ref={ref}>
      {
        typeof types != "undefined" && (            
            types.map((t,i) =>  (
                <ul className="list-group" key={`${t}`}>
                    <li className="list-group-item list-group-item-action list-group-item-primary">
                    <div className="row" style={{"cursor":"pointer"}}>                    
                        <div className="col-9 text-primary-emphasis" onClick={click}>{t}</div>
                        <div className="col-2 text-primary-emphasis" onClick={click}>
                            <div className="form-check form-switch">
                                <input id={`${idparent}_${t}`} className="form-check-input CHECK_ITEM" type="checkbox" role="switch"/>            
                            </div>
                        </div>
                        <div className="col-1 text-success-emphasis"></div>
                    </div>        
                    </li>
                </ul>            
            ))
        )
    }
    </div>
  )
}
