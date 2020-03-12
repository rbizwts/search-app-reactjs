import React from 'react';
import { NavLink, Redirect } from 'react-router-dom'
import { connect } from 'react-redux';

import Header from '../Header/Header';
import Footer from '../Footer/Footer';

import './Dashboard.css';

const Dashboard = props => {

  console.log("--- ADMIN DASHBOARD.JS ---")

  return (
    <div>

      {props.isAuthenticated === false ? <Redirect to="/admin" /> : null}
      <Header />

      <div className="container marketing" style={{ marginTop: '100px' }}>
        <div className="row text-center">

          <div className="col-md-6">
            <div className="card mb-4 shadow-sm">
              <NavLink className="pointercursor" to="/admin/categories" >
                <svg className="bd-placeholder-img card-img-top" width="100%" height="150" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Categories</title><rect width="100%" height="100%" fill="#e91e63" /><text x="50%" y="50%" fill="#eceeef" dy=".3em">Categories</text></svg>
              </NavLink>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card mb-4 shadow-sm">
              <NavLink className="pointercursor" to="/admin/users" >
                <svg className="bd-placeholder-img card-img-top" width="100%" height="150" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Users</title><rect width="100%" height="100%" fill="#FF9800" /><text x="50%" y="50%" fill="#eceeef" dy=".3em">Users</text></svg>
              </NavLink>
            </div>
          </div>

        </div>
      </div>

      <Footer />

    </div>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null
  }
}

export default connect(mapStateToProps)(Dashboard);
