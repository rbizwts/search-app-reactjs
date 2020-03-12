import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { sectionsTitle } from '../../config/constants';

import './CategoryForm.css';
import Validate from '../../helpers/validate';

const initialFormState = {
  description: {
    value: '',
    valid: false,
    touched: false,
    validationRules: {
      minLength: 2,
      isRequired: true
    },
  },
  tags: {
    value: '',
    valid: true,
    touched: false,
    validationRules: {
      isRequired: false
    },
  },
  isTagSearchOnly: {
    value: 'NO',
    valid: true,
    touched: false,
    validationRules: {
      // isRequired: true
    },
  },
  status: {
    value: 'ACTIVE',
    valid: true,
    touched: false,
    validationRules: {
      // isRequired: true
    },
  }
};

const tagsSelect = ['NO', 'YES'];
const statusSelect = ['ACTIVE', 'INACTIVE'];

const ContentForm = props => {

  const [isLoading, setisLoading] = useState(false);
  const [isNewItem, setIsNewItem] = useState(true);
  const [formData, setFormData] = useState(initialFormState)
  const [formIsValid, setFormIsValid] = useState(false)
  const [sectionDetails, setSectionDetails] = useState({})

  useEffect(() => {
    console.log("USE EFFECT CONTENTFORM.JS");
    // console.log(props)
    setSectionDetails(sectionsTitle[props.editingSection])

    if (props.defaultValue.id !== "new") {
      const editFormState = {
        ...initialFormState,
        description: {
          ...initialFormState['description'],
          value: props.defaultValue.description,
          valid: true,
        },
        tags: {
          ...initialFormState['tags'],
          value: props.defaultValue.tags,
          valid: true,
        },
        isTagSearchOnly: {
          ...initialFormState['isTagSearchOnly'],
          value: props.defaultValue.isTagSearchOnly,
          valid: true,
        },
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

  }, [props.defaultValue, props.editingSection, props.sectionsTitle])

  const updateHandler = () => {
    setisLoading(true)
    const data = {
      category: props.editingSection,
      description: formData.description.value,
      tags: formData.tags.value,
      isTagSearchOnly: formData.isTagSearchOnly.value,
      status: formData.status.value
    }

    if (isNewItem === true) {
      axios.post('/catalogue', data).then(response => {
        // console.log("response: ", response)
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

      axios.patch('/catalogue', updatedData).then(response => {
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

    setFormIsValid(formIsValid)
    inputClassNameHandler(inputIdentifier)
  }

  const inputClassNameHandler = (inputIdentifier) => {

    const content = {
      ...formData
    }

    if (content[inputIdentifier].touched && !content[inputIdentifier].valid) {
      return "form-control is-invalid";
    } else if (content[inputIdentifier].touched && content[inputIdentifier].valid) {
      return "form-control is-valid";
    } else {
      return "form-control"
    }
  }

  return (
    <div className="modal-centered">

      <h4>
        <span className="badge badge-light">{isNewItem === true ? 'Create Item' : 'Edit Item'} in {sectionDetails.title}</span>
      </h4>
      <hr style={{ marginTop: 0 }} />
      <form onSubmit={updateHandler}>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">Description</label>
          <div className="col-sm-9">
            <textarea name="description" className={inputClassNameHandler('description').concat(' TextAreaCustom')} rows="2" value={formData.description.value} onChange={inputChangehandler}></textarea>
            <span className="invalid-feedback">Please enter valid description. Minimum {formData.description.validationRules.minLength} character required.</span>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">Tags</label>
          <div className="col-sm-9">
            <input
              name="tags"
              type="text"
              className={inputClassNameHandler('tags')}
              onChange={inputChangehandler}
              value={formData.tags.value}
              placeholder="Tags" />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">Tag Search Only</label>
          <div className="col-sm-9">
            <select
              name="isTagSearchOnly"
              className={inputClassNameHandler('isTagSearchOnly')}
              value={formData.isTagSearchOnly.value}
              onChange={inputChangehandler}>
              {tagsSelect.map((t, i) => {
                return <option key={i}>{t}</option>
              })}
            </select>
          </div>
        </div>
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

export default ContentForm;
