import { ItemUnit } from "."

export const ListUnit = ({units, ref,selectedUnit,setDetailUnit,idparent}) => {
  const getChecked =function(){
    const ids = $(ref.current).find(".CHECK_ITEM").toArray().filter((chk) => (chk as HTMLInputElement).checked).map(chk => parseInt(chk.id.replace("SelUnit_","")));
        return units.filter(u => ids.includes(u.idunit));
  }
  return (
    <div ref={ref}>
      {units.map(u =>  (<ItemUnit idparent={idparent} unit = {u} key = {`${u.idunit}`} selectedUnit = {selectedUnit} setDetailUnit = {setDetailUnit}/>))}
    </div>
  )
}
