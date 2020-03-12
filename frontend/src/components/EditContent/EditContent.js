import React, { useState, useEffect } from 'react';

import Validate from '../../helpers/validate';
import axios from '../../config/axios';

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

const EditContent = props => {

  const [isLoading, setisLoading] = useState(false);
  const [isNewItem, setIsNewItem] = useState(true);
  const [formData, setFormData] = useState(initialFormState)
  const [formIsValid, setFormIsValid] = useState(true)
  const [sectionDetails, setSectionDetails] = useState({})

  useEffect(() => {
    console.log("USE EFFECT EDITCONTENT.JS");
    // console.log(props)

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
      // console.log(editFormState);
      setIsNewItem(false)
      setFormData(editFormState)
    }

    setSectionDetails(props.sectionsTitle[props.defaultValue.category])

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
        setisLoading(false)
        // console.log("Catalogue added: ", response.data)
        if (formData.isTagSearchOnly.value === 'NO' && formData.status.value === "ACTIVE") {
          props.updateHandler('created', props.editingSection, response.data);
        } else {
          props.updateHandler('created', props.editingSection, []);
        }
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

      console.log("updatedData: ", updatedData)

      axios.patch('/catalogue', updatedData).then(response => {
        setisLoading(false)
        // console.log("Catalogue added: ", response.data)
        // if (data.status.value === "ACTIVE") {
        props.updateHandler('updated', props.editingSection, updatedData);
        // } else {
        //   props.updateHandler('updated', props.editingSection, []);
        // }
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

    // console.log(val);

    const updatedFormData = {
      ...formData,
      [inputIdentifier]: {
        ...formData[inputIdentifier],
        value: val,
        valid: Validate(val, formData[inputIdentifier].validationRules),
        touched: true,
      }
    }

    // console.log(updatedFormData);

    setFormData(updatedFormData);
    let formIsValid = true;

    for (let inputID in updatedFormData) {
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

      <label>{props.keyword} - {sectionDetails.title}</label>
      <form onSubmit={updateHandler}>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">Description</label>
          <div className="col-sm-9">
            <textarea name="description" className={inputClassNameHandler('description')} rows="2" value={formData.description.value} onChange={inputChangehandler}></textarea>
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
          <label className="col-sm-3 col-form-label">Is Tag Search Only</label>
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
                &nbsp;&nbsp;Updating...
              </button>
              :
              <button type="button" className="btn btn-sm btn-success" disabled={!formIsValid} onClick={updateHandler}>Update</button>
            }
            <button type="button" className="btn btn-sm btn-secondary ml-3" onClick={props.cancelHandler}>Cancel</button>

          </div>
        </div>
      </form>
    </div>
  )
}

export default EditContent;
