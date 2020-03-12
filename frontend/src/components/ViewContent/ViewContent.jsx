import React, { useState, useEffect } from 'react';

import { add3Dots } from '../../helpers/helpers';

import './ViewContent.css';

const ViewContent = props => {

  const [sectionDetails, setSectionDetails] = useState('')

  useEffect(() => {
    console.log("USE EFFECT VIEWCONTENT.JS");

    setSectionDetails(props.sectionsTitle[props.editingSection])

  }, [props.defaultValue, props.editingSection, props.sectionsTitle])

  // console.log(props);

  return (
    <div className="modal-centered">
      <div className="form-group">
        <h4>
          <span className="badge badge-light">{sectionDetails.title}</span>
          <span className="badge badge-dark float-right mt-6">Keyword: {add3Dots(props.keyword, 15)}</span>
        </h4>
        <hr style={{ marginTop: '0' }} />
        {
          props.defaultValue.length === 0 ? 'No content added' : (
            <ul className="CustomListTwo">
              {props.defaultValue.map(row => {
                return <li key={row.id} title="Click to edit" onClick={() => props.editHandler(row, props.editingSection)}>{row.description}</li>
              })}
            </ul>
          )
        }
      </div>
      <button type="button" className="btn btn-sm btn-secondary" onClick={props.closeHandler}>Close</button>
    </div >
  )
}

export default ViewContent;
