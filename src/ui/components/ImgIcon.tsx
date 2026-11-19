import React from 'react'

export const ImgIcon = ({img,title,onClick = ()=>{},disabled = false}) => {
  return (
    <img src={img} alt={title} title={title} style={{maxHeight: "30px",maxWidth: "30px", cursor: "pointer"}} onClick={onClick} />
  )
}
