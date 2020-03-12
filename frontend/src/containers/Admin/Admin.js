import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { Redirect, NavLink } from 'react-router-dom'

import * as actions from '../../store/actions';
import Logo from '../../assets/images/logo.png'
import Login from '../../components/Auth/Login';
import Register from '../../components/Auth/Register';
import ForgotPassword from '../../components/Auth/ForgotPassword';
import ResetPassword from '../../components/Auth/ResetPassword';

const Admin = props => {

  console.log("--- ADMIN.JS ---")
  // console.log(props)

  // const [isLoading, setisLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  // const [message, setMessage] = useState({ type: '', value: '' });
  const message = useState({ type: '', value: '' })[0];

  useEffect(() => {
    console.log("USEEFFECT ADMIN.JS")
    let loc_search = props.location.search.replace("?", "")
    // console.log(loc_search)
    if (loc_search !== "") {
      props.isLoginMethod('reset');
      setResetToken(loc_search)
    } else {
      setResetToken('')
    }

    // axios.get('/user/token', {
    //   params: {
    //     token: loc_search,
    //   }
    // }).then(response => {
    //   // console.log("response: ", response)
    //   props.isLoginMethod('reset');
    //   setisLoading(false)
    //   setMessage(response.data);
    // }).catch(e => {
    //   console.log("Error: ", e)
    //   setisLoading(false)
    //   setMessage({ type: 'danger', value: 'Something went wrong while update.' });
    // })

  }, [props.location.search])

  let opacityClass = '';
  if (props.isLogin === 'forgotPass') {
    opacityClass = 'custom-opacity-2';
  }

  let error;
  if (message.type !== "") {
    error = (
      <div className={`alert alert-${message.type}`} role="alert">
        {message.value}
      </div>
    )
  }

  return (
    <div className="container">
      <div className={opacityClass}>

        {props.isAuthenticated === true ? <Redirect to="/admin/dashboard" /> : null}

        <div className="mt-5 text-center">
          <img className="mx-auto mb-4" src={Logo} alt="" width="50" height="50" />
          <h3>App Name</h3>
        </div>
        {/* <hr /> */}
        <div className="row mt-5">
          <div className="offset-md-3 col-md-6">
            {error}
            {
              (props.isLogin === 'login' || props.isLogin === 'forgotPass')
                ?
                <Login isLoginHandler={(view) => props.isLoginMethod(view)} />
                : null
            }
            {
              props.isLogin === 'register'
                ?
                <Register isLoginHandler={(view) => props.isLoginMethod(view)} />
                :
                null
            }
            {
              props.isLogin === 'reset'
                ?
                <ResetPassword resetToken={resetToken} isLoginHandler={(view) => props.isLoginMethod(view)} />
                :
                null
            }
          </div>
        </div>

        <div>
          <NavLink to="/" style={{ position: "fixed", bottom: "5px", right: "10px" }} >Back to App</NavLink>
        </div>

      </div>

      {props.isLogin === 'forgotPass' ? <ForgotPassword isLoginHandler={(view) => props.isLoginMethod(view)} /> : null}

    </div >
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null,
    isLogin: state.isLogin
    // error: state.responseMessage,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    isLoginMethod: type => dispatch(actions.isLoginMethod(type))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
