import { Modal } from "../../ui/components"
import { StopPanel } from "./StopPanel"

export const ModalStop = ({id,selectedStop,functionClose,refList,stopAuthorization,...props}: any) => {
  return (
    <Modal id = {id} title = {`Selecciona paraderos`} functionClose = {functionClose} {...props} >
        <StopPanel selectedStop = {selectedStop} refList = {refList} stopAuthorization = {stopAuthorization}/>
    </Modal>
  )
}