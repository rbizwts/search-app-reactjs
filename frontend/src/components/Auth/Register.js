import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../store/actions';
import Validate from '../../helpers/validate';

class Register extends Component {

  state = {
    isLoading: false,
    formIsValid: true,
    formData: {
      name: {
        value: 'Shr',
        valid: true,
        touched: false,
        validationRules: {
          minLength: 2,
          isRequired: true
        },
      },
      email: {
        value: 'shirish.m@wingstechsolutions.com',
        valid: true,
        touched: false,
        validationRules: {
          minLength: 2,
          isRequired: true,
          isEmail: true
        },
      },
      password: {
        value: '123456',
        valid: true,
        touched: false,
        validationRules: {
          minLength: 6,
          isRequired: true
        },
      },
      // address: {
      //   value: 'Rajkot',
      //   valid: true,
      //   touched: false,
      //   validationRules: {
      //     minLength: 2,
      //     isRequired: true
      //   },
      // },
      // country: {
      //   value: 'India',
      //   valid: true,
      //   touched: false,
      // },
    },
    // countries: [
    //   'India', 'Another'
    // ]
  }

  registerSubmitHandler = (event) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    const userData = {};
    let formElementId;
    for (formElementId in this.state.formData) {
      userData[formElementId] = this.state.formData[formElementId].value;
    }
    this.props.onRegister(userData);
    this.setState({ isLoading: false });
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

  render() {
    // let countries_select_values = (
    //   this.state.countries.map((cn, index) => {
    //     return <option key={index}>{cn}</option>
    //   })
    // );

    let submitButton = (
      <div>
        <button type="submit" className="btn btn-primary" disabled={!this.state.formIsValid}>Register</button>
        <span className="btn btn-link pointercursor" onClick={() => this.props.isLoginHandler('login')}>Already Registered User?</span>
      </div>
    );

    if (this.state.isLoading) {
      submitButton = (
        <button className="btn btn-primary" type="button" disabled>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          &nbsp;Loading...
        </button>
      );
    }

    let error = null;
    if (this.props.error) {
      error = (
        <div className="alert alert-danger" role="alert">
          {this.props.error}
        </div>
      )
    }

    let redirect = null;
    if (this.props.isAuth) {
      redirect = <Redirect to="/" />
    }

    return (

      <React.Fragment>
        {redirect}
        {/* <h1 className="mt-5">Registration</h1> */}
        {/* <p className="lead">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p> */}

        {error}

        <form onSubmit={this.registerSubmitHandler}>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Name</label>
            <div className="col-sm-10">
              <input
                name="name"
                type="text"
                className={this.inputClassNameHandler('name')}
                onChange={this.inputChangehandler}
                value={this.state.formData.name.value}
                placeholder="Name" />
              <span className="invalid-feedback">Please enter valid name. Minimum {this.state.formData.name.validationRules.minLength} character required.</span>
            </div>
          </div>
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
          {/* <div className="form-group row">
            <label className="col-sm-2 col-form-label">Address</label>
            <div className="col-sm-10">
              <input
                name="address"
                type="text"
                className={this.inputClassNameHandler('address')}
                onChange={this.inputChangehandler}
                value={this.state.formData.address.value}
                placeholder="Address" />
              <span className="invalid-feedback">Please enter valid address. Minimum {this.state.formData.address.validationRules.minLength} character required.</span>
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">Country</label>
            <div className="col-sm-10">
              <select
                name="country"
                className={this.inputClassNameHandler('country')}
                value={this.state.formData.country.value}
                onChange={this.inputChangehandler}>
                {countries_select_values}
              </select>
            </div>
          </div> */}

          <div className="form-group row">
            <div className="offset-sm-2 col-sm-10">

              {submitButton}

            </div>
          </div>

        </form>

        {/* <FooterAlert type={this.props.error.type} value={this.props.error.message} /> */}

      </React.Fragment>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    // loading: state.loading,
    error: state.responseMessage.message,
    isAuthenticated: state.token !== null,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onRegister: userData => dispatch(actions.register(userData))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);