import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ListStop } from "./ListStop";
import './css/Checkbox.css';

export const StopPanel = ({selectedStop,refList,stopAuthorization}) => {
    const { typeStay = []} = useSelector( state => (state as any).typeStay);
    const [optionCheck, setOptionCheck] = useState({authorization:false,noAuthorization:false});
    const toggleCheck = (event) => {
        const label = event.currentTarget;
        const checkbox = label.querySelector('.form-check-input');
        
        // Toggle highlight background class
        setTimeout(() => {
            if (checkbox.checked) {
                label.classList.add('selected');
            } else {
                label.classList.remove('selected');
            }
        }, 10);
    }
    const changeAuthorization = (event) =>{
        setOptionCheck({...optionCheck,authorization:event.target.checked});
        $(refList.current).find(".CHECK_ITEM").toArray().filter(it => stopAuthorization.includes(it.id.replace("SelTypeStay_",""))).forEach(it => (it as HTMLInputElement).checked = event.target.checked);
    }
    const changeNoAuthorization = (event) =>{
        setOptionCheck({...optionCheck,noAuthorization:event.target.checked});
        $(refList.current).find(".CHECK_ITEM").toArray().filter(it => !stopAuthorization.includes(it.id.replace("SelTypeStay_",""))).forEach(it => (it as HTMLInputElement).checked = event.target.checked);
    }
    useEffect(()=>{
        
    },[]);
  return (
    <>
        <div className="row">
            <div className="col-sm-6">
                <label className="option-item" onClick={event => toggleCheck(event)}>
                    <span className='option-text'>{"Autorizado"}</span>                    
                    <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" role="switch" name={"Autorizado"} value={"Autorizado"} checked = {optionCheck.authorization} onChange={changeAuthorization}/>            
                    </div>
                </label>
            </div>
            <div className="col-sm-6">
                <label className="option-item" onClick={event => toggleCheck(event)}>
                    <span className='option-text'>{"No autorizado"}</span>
                    <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" role="switch" name={"No autorizado"} value={"No autorizado"} checked = {optionCheck.noAuthorization} onChange={changeNoAuthorization}/>            
                    </div>
                </label>
            </div>
        </div>        
        <div className="row">
            <div className="col LIST-ITEMS">
                <ListStop idparent={`SelTypeStay`} ref = {refList} types = {typeStay} selectedStop = {selectedStop} />
            </div>
        </div>  
    </>
  )
}
