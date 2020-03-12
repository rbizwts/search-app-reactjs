import React, { useState, useEffect } from 'react';
import axios from '../../../config/axios';
import { connect } from 'react-redux';

import { LIMIT_RECORDS_ADMIN } from '../../../config/constants';
import { sectionsTitle } from '../../../config/constants';
import ViewContentComp from '../../../components/ViewContent/ViewContent';
import ContentForm from '../../../components/ContentForm/ContentForm';

import Header from '../Header/Header';
import SubHeader from '../SubHeader/SubHeader';
import Footer from '../Footer/Footer';

const CategoryItemList = props => {

  const [visibleState, setVisibleState] = useState('list');
  const [editItem, setEditItem] = useState({});
  const [updateCurrent, setUpdateCurrent] = useState("a");
  const [message, setMessage] = useState({ type: '', value: '' });

  useEffect(() => {
    console.log("USEEFFECT MESSAGE")
    if (message.type !== "") {
      const timeout = setTimeout(() => {
        setMessage({ type: '', value: '' })
        clearTimeout(timeout);
      }, 3000)
    }

    if (updateCurrent === "a") {
      const timeout2 = setTimeout(() => {
        setUpdateCurrent("b")
        clearTimeout(timeout2);
      }, 300)
    }

  }, [message, updateCurrent])

  // console.log(props);
  let editingSection;
  let editingSectionTitle;

  let c;
  for (c in sectionsTitle) {
    if (sectionsTitle[c].url === props.match.params.id) {
      editingSection = c;
      editingSectionTitle = sectionsTitle[c].title
    }
  }

  const editHandler = (item, index, editingSection) => {
    setVisibleState('edit');
    setEditItem(item)
  }

  const updateHandler = () => {
    setUpdateCurrent("a")
  }

  const cancelHandler = () => {
    setVisibleState('list');
  }

  const deleteHandler = (item, editingSection) => {

    // console.log("================")
    // console.log(item)
    // console.log(editingSection)

    // const data = {
    //   id: item.id
    // }

    axios.delete("/catalogue/" + item.id, {
      headers: { Authorization: `Bearer ${props.token}` }
    }).then(response => {
      console.log("DELETE SUCCESS")
      console.log(response)
      setUpdateCurrent("a")
      setMessage({ type: 'warning', value: 'Item deleted successfully' })
    }).catch(error => {
      console.log("DELETE ERROR")
      console.log(error)
      setMessage({ type: 'danger', value: 'Something went wrong, while deleteing' })
    })
    // console.log("==========deleted=========")
  }

  const responseUpdate = (resp) => {
    setVisibleState('list');
    setMessage(resp);
  }

  const addNewToggle = toggle => {

  }

  let opacityClass = '';
  if (visibleState !== 'list') {
    opacityClass = 'custom-opacity-2';
  }

  return (
    <div>
      <div className={opacityClass}>

        <Header />
        <SubHeader sectionsTitle={sectionsTitle} />

        <div className="container">
          <h1 className="mt-5">
            {editingSectionTitle}
            <span className="btn btn-primary float-right pointercursor" onClick={() => addNewToggle()} style={{ marginTop: '8px' }}>Add New</span>
          </h1>
        </div>

        <div className="container marketing" style={{ marginTop: '40px', marginBottom: '80px' }}>
          <div className="row">
            <div className="col-md-12">

              <ViewContentComp
                editingSection={editingSection}
                admin="1"
                keyword=""
                updateCurrent={updateCurrent}
                per_page={LIMIT_RECORDS_ADMIN}
                editHandler={(item, index, editingSection) => editHandler(item, index, editingSection)}
                deleteHandler={(item, editingSection) => deleteHandler(item, editingSection)} />

            </div>
          </div>
        </div>

        <Footer />
      </div>

      {
        visibleState === "edit" ?
          <ContentForm sectionsTitle={sectionsTitle} cancelHandler={cancelHandler} keyword="" editingSection={editingSection} updateHandler={updateHandler} defaultValue={editItem} responseUpdate={responseUpdate} />
          : null
      }

      {
        visibleState === "add" ?
          <ContentForm sectionsTitle={sectionsTitle} cancelHandler={cancelHandler} keyword="" editingSection={editingSection} updateHandler={updateHandler} defaultValue={{ id: 'new' }} responseUpdate={responseUpdate} />
          : null
      }
      <div className="FooterAlert">
        <div className={`alert alert-${message.type}`} role="alert">{message.value} </div>
      </div>

    </div>
  );
};

const mapStateToProps = state => {
  return {
    token: state.token
  }
}

export default connect(mapStateToProps)(CategoryItemList);
