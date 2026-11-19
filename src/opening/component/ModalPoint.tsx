import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import { Modal } from '../../ui/components';

const columnOpening = [
                        {data:'descripcion'},
                        {data:'tipo'},
                        {data:'radio'},
                        {data:'grupo'}
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
export const ModalPoint = ({id,list,selected,functionClose,...props}) => {
    DataTable.use(DT);
  return (
    <Modal id = {id} title = {`Puntos cerca`} className='modal-lg' functionClose = {functionClose} {...props} >
        <DataTable data = {list} columns={columnOpening} className="display"
            options={dataTableOption}>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Radio</th>
                    <th>Grupo</th>                    
                </tr>
            </thead>
        </DataTable>
    </Modal>
  )
}