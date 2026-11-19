import { ModalSide } from '../../ui/components';

export const ModalSideNotes = ({id,list,title,selected,functionClose,...props}) => {
    let pinSVGHole = "M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z";

  return (
    <ModalSide id = {id} title = {`${title}`} side='right' functionClose = {functionClose} {...props} >
        {
            list.map(it =>
                <div key={it.id} className='row'>
                    <div className='col-sm-4'>                        
                        <svg width="40" height="40" viewBox="0 0 20 30" xmlns="http://www.w3.org/2000/svg">
                                <path d={pinSVGHole} 
                                fill={it.color} />
                        </svg>
                    </div>
                    <div className='col-sm-8'>
                        {it.descripcion}
                    </div>
                </div>
            )
        }
    </ModalSide>
  )
}