export const CarouselImg = ({id,imgs}) => {
  return (
    <div id={id} className="carousel slide">
        <div className="carousel-inner">
        {imgs != null ? 
                        (imgs.length > 0 ? 
                                        imgs.map((i,idx) => {
                                            return <div key = {`${i.id}`} className={`carousel-item ${idx == 0 ? 'active' : ''}`}>
                                                        <img src={i.src.replace("../../","https://www.skymeduza.com/aplicacion/")} className="d-block w-100" alt={i.title} />
                                                    </div>;
                                        }) 
                                        : "") 
                    : ""
        }
            
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target={`#${id}`} data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target={`#${id}`} data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Siguiente</span>
        </button>
    </div>
  )
}
