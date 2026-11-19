import React, { useEffect } from 'react';
import "../style/ModalSide.css";

export const ModalSide = ({id,title= "Alerta", classTitle = "bg-primary-subtle", className = "", Footer = null, functionOk = null,functionClose = null, children = null, side = "left"}) => {
    const closePanel = function(){
        functionClose();
        ($(`#${id}`) as any).modal("hide");
    }
    useEffect(() => {
       /*$(`#${id}`).on("hidden.bs.modal", function (e) {
            functionClose();
        });*/
    
      return () => {
        
      }
    }, [])
    
  return (
    <div className="modal fade" id={id} tabIndex={-1} role="dialog" aria-hidden="true">
        <div className={`modal-dialog ${className} ${side == "left" ? `modal-dialog-slideout` : `modal-right`} modal-lg`}>
            <div className="modal-content">
                <div className={`modal-header ${classTitle}`}>
                    <h5 className="modal-title">{title}</h5>
                    <button type="button" className="btn-close" data-dismiss="modal" aria-label="Close" onClick={closePanel}>                    
                    </button>
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
