import React from 'react'

export const ItemRadioList = ({id, data, change, name, functionValue, selectedValue}) => {
    const isChecked = selectedValue === data.name;
    const changeRdo = (e) => {
        if(e.currentTarget.checked)
            change(data, e.currentTarget.checked);
    }
    // Highlight option row when radio is clicked
    const toggleCheck = (event) => {
        const label = event.currentTarget;
        const radio = label.querySelector('.custom-radio');
        
        // Toggle highlight background class
        setTimeout(() => {
            if (radio.checked) {
                label.classList.add('selected');
            } else {
                label.classList.remove('selected');
            }
        }, 10);
    }
  return (
    <label className={`option-item ${isChecked ? 'selected' : ''}`} onClick={event => toggleCheck(event)}>
        <span className='option-text'>{functionValue(data)}</span>
        <div className="custom-checkbox-container">
            <input id = {`${id}_Chk_${data.id}`} type="radio" className="custom-radio" name={name} value={functionValue(data)} onChange={changeRdo} onMouseDown={e => e.stopPropagation()} checked = {isChecked} />
        </div>
    </label>
  )
}
