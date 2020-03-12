import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Validate from '../../helpers/validate';
import * as actions from '../../store/actions';

class Login extends Component {

  state = {
    isLoading: false,
    formIsValid: true,
    formData: {
      email: {
        value: 'shirish.m@wingstechsolutions.com',
        valid: true,
        touched: true,
        validationRules: {
          minLength: 2,
          isRequired: true,
          isEmail: true
        },
      },
      password: {
        value: '123456',
        valid: true,
        touched: true,
        validationRules: {
          minLength: 6,
          isRequired: true
        },
      },
    }
  }

  inputChangehandler = (event) => {

    const inputIdentifier = event.target.name;
    const val = event.target.value;

    const updatedFormData = {
      ...this.state.formData,
      [inputIdentifier]: {
        ...this.state.formData[inputIdentifier],
        value: val,
        valid: Validate(val, this.state.formData[inputIdentifier].validationRules),
        touched: true,
      }
    }

    this.setState({ formData: updatedFormData });
    let formIsValid = true;

    let inputID;
    for (inputID in updatedFormData) {
      formIsValid = updatedFormData[inputID].valid && formIsValid
    }

    this.setState({ formIsValid: formIsValid })
    this.inputClassNameHandler(inputIdentifier)
  }

  inputClassNameHandler = (inputIdentifier) => {

    const formData = {
      ...this.state.formData
    }

    if (formData[inputIdentifier].touched && !formData[inputIdentifier].valid) {
      return "form-control is-invalid";
    } else if (formData[inputIdentifier].touched && formData[inputIdentifier].valid) {
      return "form-control is-valid";
    } else {
      return "form-control"
    }
  }

  loginSubmitHandler = (event) => {
    event.preventDefault();

    this.setState({ isLoading: true });

    // console.log('form sumitted');
    const userData = {};
    let formElementId;
    for (formElementId in this.state.formData) {
      userData[formElementId] = this.state.formData[formElementId].value;
    }
    this.props.onLogin(this.state.formData.email.value, this.state.formData.password.value);
    this.setState({ isLoading: false });
  }

  render() {
    let submitButton = (
      <div>
        <div>
          <button type="submit" className="btn btn-primary btn-block" disabled={!this.state.formIsValid}>Login</button>
        </div>
        <div>
          <div className="btn btn-link pointercursor" style={{ paddingLeft: '0', float: 'left' }} onClick={() => this.props.isLoginHandler('register')}>Create Account</div>
          <div className="btn btn-link pointercursor" style={{ paddingRight: '0', float: 'right' }} onClick={() => this.props.isLoginHandler('forgotPass')}>Forgot Password ?</div>
        </div>
      </div>
    );

    if (this.props.loading) {
      submitButton = (
        <button className="btn btn-primary" type="button" disabled>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          &nbsp;Loading...
        </button>
      );
    }
    let error = null;
    if (this.props.error.type !== "" && this.props.error.type !== "success") {
      error = (
        <div className={`alert alert-${this.props.error.type}`} role="alert">
          {this.props.error.message}
        </div>
      )
    }

    // console.log('this.props.isAuthenticated');
    // console.log(this.props.isAuthenticated);
    let authRedirect = null
    if (this.props.isAuthenticated) {
      authRedirect = <Redirect to="/" />
    }

    return (
      <React.Fragment>

        {authRedirect}
        {/* <p className="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p> */}

        {error}

        <form onSubmit={this.loginSubmitHandler}>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Email</label>
            <div className="col-sm-10">
              <input
                name="email"
                type="text"
                className={this.inputClassNameHandler('email')}
                onChange={this.inputChangehandler}
                value={this.state.formData.email.value}
                placeholder="Email" />
              <span className="invalid-feedback">Please enter valid email. Minimum {this.state.formData.email.validationRules.minLength} character required.</span>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Password</label>
            <div className="col-sm-10">
              <input
                name="password"
                type="password"
                className={this.inputClassNameHandler('password')}
                onChange={this.inputChangehandler}
                value={this.state.formData.password.value}
                placeholder="Password" />
              <span className="invalid-feedback">Please enter valid password. Minimum {this.state.formData.password.validationRules.minLength} character required.</span>
            </div>
          </div>
          <div className="form-group row">
            <div className="offset-sm-2 col-sm-10">
              {submitButton}
            </div>
          </div>
        </form>

      </React.Fragment >
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.responseMessage,
    authData: state.authData,
    // isAuthenticated: state.isAuth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (email, password) => dispatch(actions.login(email, password))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
