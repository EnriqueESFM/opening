export const LoadGif = ({msg,gif}) => {
  return (
    <div className="d-flex align-items-center justify-content-center">
        <img src={gif}/>
        <strong className="text-info">{msg}</strong>        
    </div>
  )
}
