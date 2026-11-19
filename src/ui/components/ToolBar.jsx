import "../components/css/ToolBar.css";

export const ToolBar = ({ actions }) => {
  return (
    
<nav className="navbar navbar-expand-lg navbar-light">
    <div className="container-fluid">
        <div className="navbar-nav d-flex flex-row">
            {actions.map((action, index) => (
                    <li className="nav-item me-3 me-lg-0" key={index}>
                        <a className="nav-link TOOLBAR"
                            title={action.label}
                            onClick={action.onClick}>
                            {action.icon}
                        </a>
                    </li>
                ))}
        </div>
    </div>
</nav>
  );
};