import React from 'react';
import { connect } from 'react-redux';
import { fadeIn } from 'react-animations';
import Radium, { StyleRoot } from 'radium';

import { add3Dots } from '../../helpers/helpers';
import './Section.css'

import { MdRemoveRedEye, MdAddCircleOutline } from 'react-icons/md';
import { IconContext } from "react-icons";

const styles = {
  fadeIn: {
    animation: 'x 1s',
    animationName: Radium.keyframes(fadeIn, 'fadeIn')
  }
}

const Section = props => {

  let buttonsGroup;
  if (props.searchInput !== '' && props.isSearch === true) {
    buttonsGroup = (
      <span>
        {props.isAuthenticated === true ?
          <span onClick={() => props.actionHandler('add', props.category)} className="example_e"><MdAddCircleOutline /></span>
          : null}
        {/* <span onClick={props.editHandler} className="example_e"><MdEdit /></span> */}
        <span onClick={() => props.actionHandler('view', props.category)} className="example_e"><MdRemoveRedEye /></span>
      </span>
    )
  }

  return (
    <StyleRoot>
      <div className="test" style={styles.fadeIn}>
        <IconContext.Provider value={{ className: "global-icons-style" }}>
          <p className="section_title">{props.title}</p>
          {buttonsGroup}
          <br />
          {
            props.sectionOutput.length === 0 ?
              props.searchInput === "" ? "" : (<p style={{ color: 'black' }}>Nothing here.</p>)
              :
              (
                <div className="">
                  <ul className="CustomListOne">
                    {props.sectionOutput.map((row, index) => {
                      return <li key={row.id} onClick={() => props.editHandler(row, index, row.category)} style={{ cursor: 'pointer' }} title="Click to edit">{add3Dots(row.description, 60)}</li>
                    })}
                  </ul>
                </div>
              )
          }
        </IconContext.Provider>
      </div>
    </StyleRoot>
  )
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null
  }
}
export default connect(mapStateToProps)(Section);
