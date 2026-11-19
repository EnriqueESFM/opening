import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import { ModalSide } from '../../ui/components';

const columnOpening = [
                        {data:'tipo'},
                        {data:'fechaHora'},
                        {data:'evento'}
                    ];
const dataTableOption = {
                                                language:{
                                                            search:"Buscar",
                                                            info:"Mostrando _START_ a _END_ de _TOTAL_ registros",                                                            
                                                            lengthMenu: "Mostrar _MENU_ registros",
                                                            emptyTable: "Ningun registro que mostrar",
                                                            infoEmpty: "Mostrando 0 a 0 de 0 registrtos",
                                                            loadingRecords: "Cargando registros...",
                                                            zeroRecords: "Ningun registro coincidente encontrado",
                                                            processing: "Procesando...",                                                          
                                                        }
                                            };
export const ModalSideEvent = ({id,list,title,selected,functionClose,...props}) => {
    DataTable.use(DT);
    const dataTableSlots = {
                                    1:(data, row) => <>{row.fechaHora.replace("T"," ").replace(".000Z","")}</>
                            }
  return (
    <ModalSide id = {id} title = {`${title}`} className='modal-lg' side='right' functionClose = {functionClose} {...props} >
        <DataTable data = {list} columns={columnOpening} className="display"
            slots={dataTableSlots}
            options={dataTableOption}>
            <thead>
                <tr>
                    <th>Tipo</th>
                    <th>Fecha Hora</th>
                    <th>Evento</th>                   
                </tr>
            </thead>
        </DataTable>
    </ModalSide>
  )
}