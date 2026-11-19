import React from 'react'

export const ItemCheckList = ({id, data, change, functionValue}) => {
    const changeChk = (e) => {
        change(data.id, e.currentTarget.checked);
    }
    // Highlight option row when checkbox is clicked
    const toggleCheck = (event) => {
        const label = event.currentTarget;
        const checkbox = label.querySelector('.custom-checkbox');
        
        // Toggle highlight background class
        setTimeout(() => {
            if (checkbox.checked) {
                label.classList.add('selected');
            } else {
                label.classList.remove('selected');
            }
        }, 10);
    }
  return (
    <label className="option-item" onClick={event => toggleCheck(event)}>
        <span className='option-text'  title = {typeof data.title != 'undefined' ? data.title : ``}>{functionValue(data)}</span>
        <div className="custom-checkbox-container">
            <input id = {`${id}_Chk_${data.id}`} type="checkbox" className="custom-checkbox" name={functionValue(data)} value={functionValue(data)} onChange={changeChk} onMouseDown={e => e.stopPropagation()} />
        </div>
    </label>
  )
}
