import React, { useState, useEffect } from 'react';

import axios from '../../config/axios';
import Validate from '../../helpers/validate';
import './UserForm.css';

const initialFormState = {
  name: {
    value: '',
    valid: false,
    touched: false,
    validationRules: {
      minLength: 2,
      isRequired: true
    },
  },
  email: {
    value: '',
    valid: false,
    touched: false,
    validationRules: {
      isEmail: true,
      isRequired: true
    },
  },
  password: {
    value: '',
    valid: false,
    touched: false,
    validationRules: {
      // minLength: 6,
      // isRequired: true
    },
  },
  // re_password: {
  //   value: '',
  //   valid: false,
  //   touched: false,
  //   validationRules: {
  //     minLength: 6,
  //     isRequired: true
  //   },
  // },
  status: {
    value: 'ACTIVE',
    valid: true,
    touched: false,
    validationRules: {
      // isRequired: true
    },
  }
};

const statusSelect = ['ACTIVE', 'INACTIVE'];

const UserForm = props => {

  const [isLoading, setisLoading] = useState(false);
  const [isNewItem, setIsNewItem] = useState(true);
  const [formData, setFormData] = useState(initialFormState)
  const [formIsValid, setFormIsValid] = useState(false)
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);

  useEffect(() => {
    console.log("USE EFFECT USERFORM.JS");

    if (props.defaultValue.id !== "new") {
      const editFormState = {
        ...initialFormState,
        name: {
          ...initialFormState['name'],
          value: props.defaultValue.name,
          valid: true,
        },
        email: {
          ...initialFormState['email'],
          value: props.defaultValue.email,
          valid: true,
        },
        // password: {
        //   ...initialFormState['password'],
        //   value: props.defaultValue.password,
        //   valid: true,
        // },
        status: {
          ...initialFormState['status'],
          value: props.defaultValue.status,
          valid: true,
        },
      }
      setIsNewItem(false)
      setFormIsValid(true)
      setFormData(editFormState)
    }

  }, [props.defaultValue, props.sectionsTitle])

  const updateHandler = () => {
    setisLoading(true)
    const data = {
      name: formData.name.value,
      email: formData.email.value,
      password: formData.password.value,
      // status: formData.status.value
    }

    if (isNewItem === true) {
      axios.post('/user', data).then(response => {
        setisLoading(false)
        props.updateHandler('new', response.data);
        props.responseUpdate({ type: 'success', value: 'Keyword inserted' });
      }).catch(e => {
        setisLoading(false)
        console.log("Error: ", e)
        props.responseUpdate({ type: 'danger', value: 'Something went wrong while update' });
      })
    }
    else {
      const updatedData = {
        ...data,
        id: props.defaultValue.id
      }

      axios.patch('/user', updatedData).then(response => {

        console.log("update resresponse:", response)
        setisLoading(false)
        props.updateHandler(props.itemIndex, updatedData);
        props.responseUpdate({ type: 'success', value: 'Keyword updated' });
      }).catch(e => {
        setisLoading(false)
        console.log("Error: ", e)
        props.responseUpdate({ type: 'danger', value: 'Something went wrong while update' });
      })
    }
  }

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
    let formIsValid = true;

    let inputID;
    for (inputID in updatedFormData) {
      formIsValid = updatedFormData[inputID].valid && formIsValid
    }

    if (isNewItem === true && inputIdentifier === 'password' && val.length < 6) {
      // console.log("password: false")
      setIsPasswordMatch(false)
      formIsValid = false;
    } else if (isNewItem === false && inputIdentifier === 'password' && val !== "" && val.length < 6) {
      // console.log("password: false")
      setIsPasswordMatch(false)
      formIsValid = false;
    } else {
      // console.log("password: true")
      setIsPasswordMatch(true)
    }

    // if (inputIdentifier === "re_password" && val !== "" && formData.password.value !== val) {
    //   setIsPasswordMatch(false)
    //   formIsValid = false;
    // } else {
    //   setIsPasswordMatch(true)
    // }

    setFormIsValid(formIsValid)
    inputClassNameHandler(inputIdentifier)
  }

  const inputClassNameHandler = (inputIdentifier) => {

    const content = {
      ...formData
    }
    // console.log("inputIdentifier:", inputIdentifier)

    if (content[inputIdentifier].touched && !content[inputIdentifier].valid) {
      return "form-control is-invalid";
    } else if (inputIdentifier === "password") {
      if (isPasswordMatch === false) {
        return "form-control is-invalid"
      } else {
        return "form-control"
      }
    } else if (content[inputIdentifier].touched && content[inputIdentifier].valid) {
      return "form-control is-valid";
    } else {
      return "form-control"
    }
  }

  return (
    <div className="modal-centered">

      <h4>
        <span className="badge badge-light">{isNewItem === true ? 'Create User' : 'Edit User'}</span>
      </h4>
      <hr style={{ marginTop: 0 }} />
      <form onSubmit={updateHandler}>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">Name</label>
          <div className="col-sm-9">
            <input
              name="name"
              type="text"
              className={inputClassNameHandler('name')}
              onChange={inputChangehandler}
              value={formData.name.value}
              placeholder="Name" />
            <span className="invalid-feedback">Please enter valid name. Minimum {formData.name.validationRules.minLength} character required.</span>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">Email</label>
          <div className="col-sm-9">
            <input
              name="email"
              type="text"
              className={inputClassNameHandler('email')}
              onChange={inputChangehandler}
              value={formData.email.value}
              placeholder="Email" />
            <span className="invalid-feedback">Please enter valid name. Minimum {formData.name.validationRules.minLength} character required.</span>
          </div>
        </div>
        {/* {isNewItem === true ? */}
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
            {/* {isPasswordMatch === false ? <span style={{ width: '100%', marginTop: ".25rem", fontSize: "80%", color: "#dc3545" }}>Password does not match.</span> : null} */}
          </div>
        </div>
        {/* <div className="form-group row">
          <label className="col-sm-3 col-form-label">Confirm Pwd</label>
          <div className="col-sm-9">
            <input
              name="re_password"
              type="password"
              className={inputClassNameHandler('re_password')}
              onChange={inputChangehandler}
              value={formData.re_password.value}
              placeholder="Please confirm password" />
            <span className="invalid-feedback">Please enter valid name. Minimum {formData.re_password.validationRules.minLength} character required.</span>
          </div>
        </div> */}
        {/* : null} */}
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">Status</label>
          <div className="col-sm-9">
            <select
              name="status"
              className={inputClassNameHandler('status')}
              value={formData.status.value}
              onChange={inputChangehandler}>
              {statusSelect.map((t, i) => {
                return <option key={i}>{t}</option>
              })}
            </select>
          </div>
        </div>

        <div className="form-group row">
          <div className="offset-sm-3 col-sm-9">

            {isLoading ?
              <button className="btn btn-sm btn-success" type="button" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                &nbsp;&nbsp;{isNewItem === true ? 'Creating' : 'Updating'}...
              </button>
              :
              <button type="button" className="btn btn-sm btn-success" disabled={!formIsValid} onClick={updateHandler}>{isNewItem === true ? 'Create' : 'Update'}</button>
            }
            <button type="button" className="btn btn-sm btn-secondary ml-3" onClick={props.cancelHandler}>Cancel</button>

          </div>
        </div>
      </form>
    </div>
  )
}

export default UserForm;
