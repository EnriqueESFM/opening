import { useState, type FC  } from "react";
import cn from "classnames";

import "../style/FAB.scss";

export const FAB: FC<any> = ({ actions, Icon,title = "", position = "",actionDirection = "fab-action-up", click = ()=>{} }) => {
  const [open, setOpen] = useState(false);

  // Set open state to true if user hover over "ul" element 
  const mouseEnter = () => setOpen(true);

  // Set open state to false if user hover out of "ul" element 
  const mouseLeave = () => setOpen(false);

  return (
    <ul
      className={`fab-container ${position=="absolute" ? "" : position}`}
      style={position=="absolute" ? {position:"absolute"} :{} }
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
    >
      <li className="fab-button" onClick={click}>
        <Icon title = {title} />
      </li>
      {actions.map((action:any, index: number) => (
        <li
          style={{ transitionDelay: `${index * 25}ms` }}
          className={cn(actionDirection, { open })}
          key={action.label}
          onClick={action.onClick}
        >
          {action.icon}
          <span className="tooltip">{action.label}</span>
        </li>
      ))}
    </ul>
  );
};