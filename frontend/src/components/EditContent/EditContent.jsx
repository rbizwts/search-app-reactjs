import React, { useState, useEffect } from 'react';

import { db } from '../../config/firebase';

const EditContent = props => {

  const [isLoading, setisLoading] = useState(false);
  // const [message, setMessage] = useState({ type: '', value: '' });
  const [inputValue, setInputValue] = useState('')
  const [sectionDetails, setSectionDetails] = useState({})

  useEffect(() => {
    console.log("USE EFFECT EDITCONTENT.JS");

    let section_name = `section_${props.editingSection}`
    let inputValue = props.defaultValue[section_name]
    setInputValue(inputValue);


    for (var i = 0; i < props.sectionsTitle.length; i++) {
      if (props.sectionsTitle[i].key === props.editingSection) {
        setSectionDetails(props.sectionsTitle[i]);
      }
    }

  }, [props.defaultValue, props.editingSection, props.sectionsTitle])

  const inputHandler = value => {
    setInputValue(value);
  }

  const updateHandler = () => {
    setisLoading(true)
    if (props.defaultValue.id === 'new') {

      delete props.defaultValue.id;

      db.collection('search-app').add({
        ...props.defaultValue,
        keyword: props.keyword.toLowerCase(),
        ['section_' + props.editingSection]: inputValue,
      }).then(docRef => {
        setisLoading(false)
        // setMessage({ type: 'success', value: 'Keyword inserted' });
        console.log("Keyword inserted: ", docRef.id);
        props.updateHandler(docRef.id, inputValue);
        props.responseUpdate({ type: 'success', value: 'Keyword inserted' });
      }).catch(e => {
        setisLoading(false)
        console.log("Something went wrong while insert", e);
        // setMessage({ type: 'error', value: 'Something went wrong while update' });
        props.responseUpdate({ type: 'danger', value: 'Something went wrong while update' });
      })
    } else {
      db.collection('search-app').doc(props.defaultValue.id).update({
        ['section_' + props.editingSection]: inputValue,
      }).then(e => {
        setisLoading(false)
        // setMessage({ type: 'success', value: 'Keyword updated' });
        console.log("Keyword updated");
        props.updateHandler(props.defaultValue.id, inputValue);
        props.responseUpdate({ type: 'success', value: 'Keyword updated' });
      }).catch(e => {
        setisLoading(false)
        // setMessage({ type: 'error', value: 'Something went wrong while update' });
        props.responseUpdate({ type: 'danger', value: 'Something went wrong while update' });
        console.log("Something went wrong while update", e);
      })
    }
  }

  return (
    <div className="modal-centered">
      <div className="form-group">
        <label>{props.keyword} - {sectionDetails.title}</label>
        <textarea className="form-control" rows="6" value={inputValue} onChange={(e) => inputHandler(e.target.value)}></textarea>
      </div>

      {isLoading ?
        <button className="btn btn-sm btn-success" type="button" disabled>
          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          &nbsp;&nbsp;Updating...
        </button> :
        <button type="button" className="btn btn-sm btn-success" onClick={updateHandler}>Update</button>
      }
      <button type="button" className="btn btn-sm btn-secondary ml-3" onClick={props.cancelHandler}>Cancel</button>
    </div>
  )
}

export default EditContent;
