import axios from '../config/axios';

import * as actionTypes from './actionTypes';


export const isLoginMethod = viewPage => {
  return {
    type: actionTypes.IS_LOGIN,
    viewPage: viewPage
  }
}

export const tryAutoLogin = token => {

  console.log("tryAutoLogin called");
  return dispatch => {
    dispatch(tryAutoLoginStart())
    axios.get('/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(response => {
      // console.log("respone: ", response)
      if (response.data.status === true) {
        localStorage.setItem('app-token', response.data.token)
        localStorage.setItem('expires', 3600)

        dispatch(autoLogin(response.data.data, response.data.token));
      } else {
        console.log("error - 1")
        localStorage.removeItem('app-token')
        localStorage.removeItem('expires')
        // dispatch(loginFailed(response.data.error))
      }
    }).catch(error => {
      console.log("error - 2")
      console.log(error)
      localStorage.removeItem('app-token')
      localStorage.removeItem('expires')
      // dispatch(loginFailed(error))
    })
  }
}

export const tryAutoLoginStart = () => {
  return {
    type: actionTypes.TRY_AUTO_LOGIN_START,
  }
}

export const login = (email, password) => {
  return dispatch => {
    dispatch(loginStart())
    axios.post('/user/login', {
      email: email,
      password: password
    }).then(response => {
      if (response.data.status === true) {
        localStorage.setItem('app-token', response.data.token)
        localStorage.setItem('expires', 3600)

        dispatch(loginSuccess(response.data.data, response.data.token));
      } else {
        dispatch(loginFailed(response.data.error))
      }
    }).catch(error => {
      dispatch(loginFailed(error.message))
    })
  }
}

export const loginStart = () => {
  return {
    type: actionTypes.LOGIN_START,
    loading: true
  }
}

export const loginSuccess = (data, token) => {
  return {
    type: actionTypes.LOGIN_SUCCESS,
    data: data,
    token: token,
    loading: false
  }
}

export const autoLogin = (data, token) => {
  return {
    type: actionTypes.TRY_AUTO_LOGIN,
    data: data,
    token: token
  }
}

export const loginFailed = error => {
  return {
    type: actionTypes.LOGIN_FAILED,
    loading: false,
    error: error
  }
}

export const register = userData => {
  return dispatch => {
    dispatch(registerStart())

    axios.get('/user/email', {
      params: {
        email: userData.email
      }
    }).then(emailExists => {

      if (emailExists === false) {
        axios.post('/user/register', {
          ...userData
        }).then(response => {
          dispatch(registerSuccess(response));
        }).catch(error => {
          dispatch(registerFailed(error))
        })
      } else {
        dispatch(registerFailed("Email already exists"))
      }

    }).catch(error => {
      dispatch(registerFailed(error))
    })


  }
}

export const registerStart = () => {
  return {
    type: actionTypes.REGISTER_START,
  }
}

export const registerSuccess = userData => {
  return {
    type: actionTypes.REGISTER_SUCCESS,
    data: userData
  }
}

export const registerFailed = error => {
  return {
    type: actionTypes.REGISTER_FAILED,
    error: error
  }
}

export const beforeLogout = () => {
  localStorage.removeItem('app-token')
  localStorage.removeItem('expires')
  return {
    type: actionTypes.LOGOUT
  }
}