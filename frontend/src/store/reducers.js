import * as actionTypes from './actionTypes';

const initialResponseMessage = { type: '', message: '' }

const initialState = {
  authData: null,
  // isAuthenticated: false,
  token: null,
  loading: false,
  responseMessage: initialResponseMessage,
  isLogin: 'login'
}

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case actionTypes.IS_LOGIN:
      return { ...state, isLogin: action.viewPage }
    case actionTypes.TRY_AUTO_LOGIN_START:
      return { ...state, loading: true }
    case actionTypes.TRY_AUTO_LOGIN:
      return { ...state, loading: false, authData: action.data, token: action.token }
    case actionTypes.LOGIN_START:
      return { ...state, loading: true, responseMessage: initialResponseMessage }
    case actionTypes.LOGIN_SUCCESS:
      return { ...state, authData: action.data, token: action.token, loading: false, responseMessage: { type: 'success', message: 'Login successfull' } }
    case actionTypes.LOGIN_FAILED:
      return { ...state, loading: false, authData: null, token: null, responseMessage: { type: 'danger', message: action.error } }
    case actionTypes.LOGOUT:
      return { ...state, loading: false, authData: null, token: null }
    case actionTypes.REGISTER_START:
      return { ...state, loading: true, responseMessage: initialResponseMessage }
    case actionTypes.REGISTER_SUCCESS:
      return { ...state, authData: action.data, token: action.data.id, loading: false, responseMessage: { type: 'success', message: 'Register successfull' } }
    case actionTypes.REGISTER_FAILED:
      return { ...state, loading: false, authData: null, token: null, responseMessage: { type: 'danger', message: action.error } }
    default:
      return state
  }
}

export default reducer;