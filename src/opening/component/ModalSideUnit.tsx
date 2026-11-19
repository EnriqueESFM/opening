import {ModalSide} from '../../ui/components';
import {UnitPanel} from './UnitPanel';

export const ModalSideUnit = ({id,selectedUnit,setDetailUnit,functionClose,refList,...props}: any) => {
  return (
    <ModalSide id = {id} title = {`Selecciona unidades`} functionClose = {functionClose} {...props} >
        <UnitPanel selectedUnit = {selectedUnit} setDetailUnit = {setDetailUnit} refList = {refList}/>
    </ModalSide>
  )
}
