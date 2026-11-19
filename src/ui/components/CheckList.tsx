import { ItemCheckList } from "./ItemCheckList";
import "../components/css/CheckList.css";

export const CheckList = ({refList,id,value,list,change,changeAll,functionValue}) => {
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

  const changeAllChk = event => {
    const panel = event.currentTarget.parentElement.parentElement.querySelector('.custom-options-panel');
    if(panel)
      panel.querySelectorAll(".custom-checkbox").forEach(chk => {
        chk.checked = event.currentTarget.checked;
      });
      if(event.currentTarget.checked)
        event.currentTarget.parentElement.parentElement.classList.add('open');
      changeAll(event.currentTarget.checked);
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
            <div className={`custom-select-container`}>
                {/*Select Header Bar*/}
                <div className="custom-select-trigger trigger-dark-blue option-text" onClick={ event => toggleOptions(event)}>
                    <span className="trigger-label">{value}</span>
                    <i className="fa-solid fa-chevron-down trigger-icon"></i>
                    <input 
                        type="checkbox" 
                        className="custom-checkbox header-checkbox" 
                        onClick={e => e.stopPropagation()}
                        onChange={changeAllChk}
                        
                    />                    
                </div>
                {/*Options Panel*/}
                <div className="custom-options-panel">
                    {list.map((it,i) => (
                        <ItemCheckList id = {id} key={it.id} data={it} change = {change} functionValue={functionValue} />
                    ))}
                </div>
            </div>
        </div>
  )
}


