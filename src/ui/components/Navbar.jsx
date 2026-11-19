import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../context';


export const Navbar = () => {
    const {user,logout }= useContext(GlobalContext);
    const navigate = useNavigate();
    const onLogout = () => {
        logout()
        navigate('login',{
            replace: true
        });
    };
    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark p-2">
            <a className="navbar-brand text-info">{user?.nombre}</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <NavLink 
                            className={({isActive})=> `nav-item nav-link ${ isActive ? 'active' : ''}`} 
                            to="/"
                        >
                            Buscar
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink 
                            className={({isActive})=> `nav-item nav-link ${ isActive ? 'active' : ''}`} 
                            to="/track"
                        >
                            Posición
                        </NavLink>
                    </li>                    
                </ul>
                <div className="navbar-collapse collapse w-100 order-3 dual-collapse2 d-flex justify-content-end">
                    <ul className="navbar-nav ml-auto">
                    
                        <button className="btn btn-outline-info" onClick={onLogout}>
                            Logout
                        </button>                    
                    </ul>
                </div>
            </div>                        
        </nav>
    )
}