export const SpinnerLoad = ({msg,classSpinner = "spinner-border text-info"}) => {
  return (
    <div className="d-flex align-items-center">
        <strong className="text-info">{msg}</strong>
        <div className={`${classSpinner} ms-auto`} role="status" aria-hidden="true"></div>
    </div>
  )
}
