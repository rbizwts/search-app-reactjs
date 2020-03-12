import React from 'react';
import { Route, NavLink } from 'react-router-dom'

import './Layout.css';
import UserIcon from '../../../assets/images/user.png';
import CategoryIcon from '../../../assets/images/clipboard.png';

import Dashboard from '../Dashboard/Dashboard';
import Category from '../Category/Category'
import User from '../User/User'

const Dashboard = props => {
  return (
    <div>
      <header>
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <span className="navbar-brand pointercursor" href="#">AdminPanel</span>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <span className="nav-link pointercursor" href="#">Home <span className="sr-only">(current)</span></span>
              </li>
              <li className="nav-item">
                <span className="nav-link pointercursor" href="#">Link</span>
              </li>
              <li className="nav-item">
                <span className="nav-link disabled pointercursor" href="#">Disabled</span>
              </li>
            </ul>
            <form className="form-inline mt-2 mt-md-0">
              <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
          </div>
        </nav>
      </header>

      <main role="main" style={{ marginTop: '100px' }}>

       Item

      </main>

      <footer className="footer mt-auto py-3">
        <div className="container">
          <span>&copy; 2017-2019 Company, Inc. </span>
        </div>
      </footer>

    </div>
  );
};

export default Dashboard;
