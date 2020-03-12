import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = props => {
  return (
    <header>
      <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
        <NavLink className="navbar-brand pointercursor" to="/admin/dashboard">AdminPanel</NavLink>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink className="nav-link pointercursor" to="/admin/dashboard">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link pointercursor" to="/admin/categories">Categories</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link pointercursor" to="/admin/users">Users</NavLink>
            </li>
          </ul>
          <form className="form-inline mt-2 mt-md-0">
            <NavLink className="btn btn-outline-primary my-2 my-sm-0 pointercursor mr-2" to="/">App</NavLink>
            <NavLink className="btn btn-outline-danger my-2 my-sm-0 pointercursor" to="/admin/logout">Logout</NavLink>
          </form>
        </div>
      </nav>
    </header>
  );
};

export default Header;
