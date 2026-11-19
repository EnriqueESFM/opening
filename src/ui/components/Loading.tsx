export const Loading = ({text}) => {
  return (
    <div className="text-center position-absolute top-50 start-50 translate-middle animate__animated animate__zoomInDown">
      <div className="card border-info mb-3 text-center" style={{"maxWidth": "18rem"}}>
        <div className="card-header bg-transparent border-info text-info">{text}...</div>
        <div className="card-body">
            <h5 className="card-title">{}</h5>
            
                <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            
        </div>
      </div>
    </div>
  )
}
