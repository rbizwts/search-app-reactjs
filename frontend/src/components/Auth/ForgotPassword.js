import React, { useState, useEffect } from 'react';

import axios from '../../config/axios';
import Validate from '../../helpers/validate';

const emailState = {
  value: 'shirish.m@wingstechsolutions.com',
  valid: true,
  touched: false,
  validationRules: {
    isEmail: true,
    isRequired: true
  },
};

const ForgotPassword = props => {

  const [isLoading, setisLoading] = useState(false);
  const [emailData, setEmailData] = useState(emailState)
  const [message, setMessage] = useState({ type: '', value: '' })

  useEffect(() => {
    console.log("USE EFFECT FORGOTPASSWORD.JS")
    if (message.type !== "") {
      const timeout = setTimeout(() => {
        setMessage({ type: '', value: '' })
        clearTimeout(timeout);
      }, 6000)
    }
  }, [message])

  const updateHandler = () => {
    setisLoading(true)

    axios.get('/user/forgot-password', {
      params: {
        email: emailData.value,
      }
    }).then(response => {
      // console.log("response: ", response)
      setisLoading(false)
      setMessage(response.data);
    }).catch(e => {
      setisLoading(false)
      console.log("Error: ", e)
      setMessage({ type: 'danger', value: 'Something went wrong while update.' });
    })

  }

  const inputChangehandler = (event) => {
    const val = event.target.value;
    const updatedEmailData = {
      ...emailData,
      value: val,
      valid: Validate(val, emailData.validationRules),
      touched: true,
    }

    setEmailData(updatedEmailData);
  }

  let classNameVar = "form-control";

  if (emailData.touched && !emailData.valid) {
    classNameVar = "form-control is-invalid";
  } else if (emailData.touched && emailData.valid) {
    classNameVar = "form-control is-valid";
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
    <div className="modal-centered">

      <h4>
        <span className="badge badge-light">Forgot Password</span>
      </h4>
      <hr style={{ marginTop: 0 }} />
      <form onSubmit={updateHandler}>
        <div className="form-group row">
          <div className="col-sm-12">
            <input
              name="email"
              type="text"
              className={classNameVar}
              onChange={inputChangehandler}
              value={emailData.value}
              placeholder="Please enter email address" />
            <span className="invalid-feedback">Please enter valid email.</span>
          </div>
        </div>

        {error}
        <div className="form-group row">
          <div className="col-sm-12">
            {isLoading ?
              <button className="btn btn-sm btn-success" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                &nbsp;&nbsp;Sending...
              </button>
              :
              <button type="button" className="btn btn-sm btn-success" disabled={!emailData.valid} onClick={updateHandler}>Send</button>
            }
            <button type="button" className="btn btn-sm btn-secondary ml-3" onClick={() => props.isLoginHandler('login')}>Cancel</button>

          </div>
        </div>
      </form>
    </div>
  )
}

export default ForgotPassword;
