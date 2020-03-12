import React, { useEffect } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { tryAutoLogin } from '../../store/actions';

import './Layout.css'

// import Home from '../Home/Home';
import Home from '../../containers/Home/Home';
import Admin from '../../containers/Admin/Admin';
import AdminLogout from '../../components/Auth/Logout';
// import AdminLayout from '../Layout/Layout';

import AdminDashboard from '../../containers/Admin/Dashboard/Dashboard';
import AdminCategory from '../../containers/Admin/Category/Category';
// import AdminCategoryItemList from '../Admin/CategoryItemList/CategoryItemList';
import AdminCategoryItemList from '../../components/CategoryItem/CategoryItem';
import AdminUser from '../../components/User/User';
import Loader from '../../components/Loader/Loader'

const Layout = props => {

  useEffect(() => {

    if (props.isAuthenticated === false) {
      let token = localStorage.getItem('app-token')

      // console.log('token: ', token)
      if (token !== null) {
        // console.log('token is set')
        props.tryAutoLoginWithToken(token);
      } else {
        // console.log('token not set')
      }
    }

  }, [props])

  return (
    <React.Fragment>

      {
        props.loading === true ?
          <div className="DisplayCenter">
            <Loader width="80" />
          </div>
          :

          props.isAuthenticated === false
            ?
            <Switch>
              <Route path="/admin" component={Admin} />
              <Route path="/" exact component={Home} />
              <Redirect to="/" />
            </Switch>
            :
            <Switch>
              <Route path="/admin" exact component={Admin} />
              <Route path="/admin/logout" exact component={AdminLogout} />
              <Route path="/admin/dashboard" exact component={AdminDashboard} />
              <Route path="/admin/categories" exact component={AdminCategory} />
              <Route path="/admin/categories/:id" exact component={AdminCategoryItemList} />
              <Route path="/admin/users" exact component={AdminUser} />
              <Route path="/" exact component={Home} />
              <Redirect to="/" />
            </Switch>
      }
    </React.Fragment >
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null,
    loading: state.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    tryAutoLoginWithToken: (token) => dispatch(tryAutoLogin(token))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout));
