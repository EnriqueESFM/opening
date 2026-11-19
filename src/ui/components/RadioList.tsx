import { ItemRadioList } from "./ItemRadioList";
import "../components/css/RadioList.css";
import { useState } from "react";

export const RadioList = ({refList,id,name,list,open,change,functionValue, defaultValue}) => {
    const [selectedValue, setSelectedValue] = useState(list.length > 0 ? functionValue(list.filter(l => l.name == defaultValue)[0]) : null);
    const changeRdo = (data,checked) => {
        setSelectedValue(data.name);
        change(data.id,checked);
    }
    const toggleOptions = (event)=>{
        const container = event.currentTarget.closest('.custom-select-container');
        const panel = container.querySelector('.custom-options-panel');
        
        if (container.classList.contains('open')) {
            container.classList.remove('open');
            //panel.style.display = 'none';
        } else {
            container.classList.add('open');
            //panel.style.display = 'block';
        }
    }

    document.addEventListener('mousedown', function(event) {
        document.querySelectorAll('.custom-select-container').forEach(container => {
            // Si el clic ocurrió FUERA del contenedor de esta lista
            if (!container.contains(event.target as any)) {
                container.classList.remove('open');
                /*const panel = container.querySelector('.custom-options-panel');
                if(panel) 
                panel.classList.remove('open');*/
            }
        });
    });
  return (
        <div ref={refList} className="dropdown-container">
            <div className={`custom-select-container${open ? ` open` : ``}`}>
                {/*Select Header Bar*/}
                <div className="custom-select-trigger trigger-dark-blue option-text" onClick={ event => toggleOptions(event)}>
                    <span className="trigger-label">{selectedValue}</span>
                    <i className="fa-solid fa-chevron-down trigger-icon"></i>                    
                </div>
                {/*Options Panel*/}
                <div className="custom-options-panel">
                    {list.map((it,i) => (
                        <ItemRadioList id = {id} key={it.id} data={it} change = {changeRdo} name ={name} functionValue={functionValue} selectedValue = {selectedValue} />
                    ))}
                </div>
            </div>
        </div>
  )
}


