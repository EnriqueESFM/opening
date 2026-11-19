import { useEffect } from "react";

export const Modal = ({id,show="",title= "Alerta", classTitle = "bg-primary-subtle", className = "", Footer = null, functionOk = null,functionClose = ()=>{}, children = null}) => {
    const closePanel = function(e){
        functionClose.call(this,e);
        ($(`#${id}`) as any).modal("hide");
    }
    useEffect(() => {
        $(`#${id}`).on("hidden.bs.modal", function () {
            functionClose.call(this);
        });
    
        return () => {
        
        }
    }, []);
  return (
    <div className={`modal fade ${show}`} id={id} tabIndex={-1} aria-labelledby={`${id}Label`} aria-hidden="true">
        <div className={`modal-dialog modal-dialog-scrollable ${className}`}>
            <div className="modal-content">
            <div className={`modal-header ${classTitle}`}>
                <h1 className="modal-title fs-5" id={`${id}Label`}>{title}</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closePanel}></button>
            </div>
            <div className="modal-body">
                {children}
            </div>
            <div className="modal-footer">
            {
                        // <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        // <button type="button" className="btn btn-primary">Save changes</button>
                        Footer!=null ? <Footer/> :
                                                    <>
                                                        {
                                                            functionClose != null ?
                                                                <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={closePanel}>Cerrar</button>
                                                            : ""
                                                        }
                                                        {
                                                            functionOk != null ?
                                                                <button type="button" className="btn btn-primary">Aceptar</button>
                                                            : ""

                                                        }                                                        
                                                    </>
                    }
            </div>
            </div>
        </div>
        </div>
  )
}
