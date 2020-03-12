import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from '../../config/axios';

import Validate from '../../helpers/validate';
import * as actions from '../../store/actions';

const ResetPassword = props => {

  // console.log(props)

  const initialFormState = {
    password: {
      value: '',
      valid: true,
      touched: false,
      validationRules: {
        minLength: 6,
        isRequired: true
      },
    },
    re_password: {
      value: '',
      valid: true,
      touched: false,
      validationRules: {
        minLength: 6,
        isRequired: true
      },
    },
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [formData, setFormData] = useState(initialFormState);
  const [message, setMessage] = useState({ type: '', value: '' });

  useEffect(() => {
    let loc_search = props.resetToken

    axios.get('/user/token', {
      params: {
        token: loc_search,
      }
    }).then(response => {
      setIsLoading(false)
      if (response.data.type === "danger") {
        setIsTokenValid(false);
        setMessage(response.data);
      } else {
        setIsTokenValid(true);
      }

    }).catch(e => {
      console.log("Error: ", e)
      setIsLoading(false)
      setMessage({ type: 'danger', value: 'Something went wrong while update.' });
    })

  }, [props.resetToken])

  const inputChangehandler = (event) => {

    const inputIdentifier = event.target.name;
    const val = event.target.value;

    const updatedFormData = {
      ...formData,
      [inputIdentifier]: {
        ...formData[inputIdentifier],
        value: val,
        valid: Validate(val, formData[inputIdentifier].validationRules),
        touched: true,
      }
    }

    setFormData(updatedFormData);
    let isFormValid = true;

    let inputID;
    for (inputID in updatedFormData) {
      isFormValid = updatedFormData[inputID].valid && isFormValid
    }

    if (val !== "" && formData.password.value !== val) {
      setIsPasswordMatch(false)
    } else {
      setIsPasswordMatch(true)
    }

    setIsFormValid(isFormValid)
    inputClassNameHandler(inputIdentifier)
  }

  const inputClassNameHandler = (inputIdentifier) => {

    const formDataUpdated = {
      ...formData
    }

    if (formDataUpdated[inputIdentifier].touched && !formDataUpdated[inputIdentifier].valid) {
      return "form-control is-invalid";
    } else if (formDataUpdated[inputIdentifier].touched && formDataUpdated[inputIdentifier].valid) {
      return "form-control is-valid";
    } else {
      return "form-control"
    }
  }

  const submitHandler = (event) => {
    event.preventDefault();

    setIsLoading(true);

    console.log('form sumitted');

    axios.post('/user/reset-password', {
        token: props.resetToken,
        password: formData.password.value,
        re_password: formData.re_password.value
    }).then(response => {
      console.log(response)
      if(response.data === true) {
        setIsTokenValid(false);
        setMessage({ type: 'info', value: 'Password has been updated. Please login.' });
      } else {
        setMessage({ type: 'danger', value: 'Something went wrong while update password.' });
      }
    }).catch(error => {
      console.log(error)
    }).then(() => {
      setIsLoading(false);
    })
  }

  let submitButton = (

    <div>
      <button type="submit" className="btn btn-primary btn-block" disabled={!isFormValid}>Reset Password</button>
    </div>
  );



  if (isLoading) {
    submitButton = (
      <button className="btn btn-primary" type="button" disabled>
        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        &nbsp;Loading...
        </button>
    );
  }
  let error = null;
  if (message.type !== "") {
    error = (
      <div className={`alert alert-${message.type}`} role="alert">
        {message.value}
      </div>
    )
  }

  let authRedirect = null
  if (props.isAuthenticated) {
    authRedirect = <Redirect to="/" />
  }

  return (
    <React.Fragment>

      {authRedirect}

      {error}

      {isTokenValid === false ? null :
        <form onSubmit={submitHandler}>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label">Password</label>
            <div className="col-sm-9">
              <input
                name="password"
                type="password"
                className={inputClassNameHandler('password')}
                onChange={inputChangehandler}
                value={formData.password.value}
                placeholder="Password" />
              <span className="invalid-feedback">Please enter valid password. Minimum {formData.password.validationRules.minLength} character required.</span>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-3 col-form-label">Re-enter</label>
            <div className="col-sm-9">
              <input
                name="re_password"
                type="password"
                className={inputClassNameHandler('re_password')}
                onChange={inputChangehandler}
                value={formData.re_password.value}
                placeholder="Re-enter Password" />
              <span className="invalid-feedback">Please enter valid password. Minimum {formData.re_password.validationRules.minLength} character required.</span>
              {isPasswordMatch === false ? <span style={{ width: '100%', marginTop: ".25rem", fontSize: "80%", color: "#dc3545" }}>Password does not match.</span> : null}
            </div>
          </div>
          <div className="form-group row">
            <div className="offset-sm-3 col-sm-9">
              {submitButton}
            </div>
          </div>
        </form>
      }
      <div className="btn btn-link pointercursor float-right" style={{ paddingLeft: '0', float: 'left' }} onClick={() => props.isLoginHandler('login')}>Go to Login</div>

    </React.Fragment >
  )

}

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.responseMessage.message,
    authData: state.authData,
    // isAuthenticated: state.isAuth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (password, re_password) => dispatch(actions.login(password, re_password))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
