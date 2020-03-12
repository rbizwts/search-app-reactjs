import React from 'react';

import { LIMIT_RECORDS_FRONT } from '../../config/constants';
import { add3Dots } from '../../helpers/helpers';
import ViewContentComp from '../../components/ViewContent/ViewContent'
import './ViewContent.css';

const ViewContent = props => {

  // console.log(props);

  return (
    <div className="modal-centered" style={{width: '90%'}}>

      <div className="form-group">
        <h4>
          <span className="badge badge-light">{props.sectionsTitle[props.editingSection].title}</span>
          <span className="badge badge-dark float-right mt-6">Keyword: {add3Dots(props.keyword, 15)}</span>
        </h4>
        {/* <hr style={{ marginTop: '0' }} /> */}

        <ViewContentComp editingSection={props.editingSection} keyword={props.keyword} per_page={LIMIT_RECORDS_FRONT} editHandler={(item, index, editingSection) => props.editHandler(item, index, editingSection)} />

      </div>
      <button type="button" className="btn btn-sm btn-secondary float-right" onClick={props.closeHandler}>Close</button>
    </div >
  )
}

export default ViewContent;
