import React, { useState, useEffect } from 'react';

import axios from '../../../config/axios';
import { LIMIT_RECORDS_ADMIN } from '../../../config/constants';
import { sectionsTitle } from '../../../config/constants';
import ViewContentComp from '../../../components/ViewContent/ViewContent';
import TabularData from '../../../components/TabularData/TabularData';
import ContentForm from '../../../components/ContentForm/ContentForm';

import Header from '../Header/Header';
import SubHeader from '../SubHeader/SubHeader';
import Footer from '../Footer/Footer';

const CategoryItemList = props => {

  const [visibleState, setVisibleState] = useState('list');
  const [editItem, setEditItem] = useState({});
  const [message, setMessage] = useState({ type: '', value: '' });
  const [tabularData, setTabularData] = useState({ data: null, total: null, per_page: LIMIT_RECORDS_ADMIN, current_page: 1 })

  useEffect(() => {
    console.log("USEEFFECT MESSAGE")
    makeHttpRequestWithPage(1)

    if (message.type !== "") {
      const timeout = setTimeout(() => {
        setMessage({ type: '', value: '' })
        clearTimeout(timeout);
      }, 3000)
    }
  }, [message])

  const makeHttpRequestWithPage = pageNumber => {

    axios.get('catalogue/page-search', {
      params: {
        keyword: props.keyword,
        admin: props.admin ? 1 : 0,
        category: props.editingSection,
        per_page: tabularData.per_page,
        current_page: pageNumber
      }
    }).then(response => {
      // console.log(response);
      setTabularData({
        data: response.data.rows,
        total: response.data.count,
        per_page: tabularData.per_page,
        current_page: pageNumber,
      });
    }).catch(error => {
      console.log(error);
    })
  }

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

  // useEffect(() => {

  //   // editingSection = props.match.params.id;

  // }, [props])

  const editHandler = (item, index, editingSection) => {
    setVisibleState('edit');
    setEditItem(item)
  }

  const updateHandler = () => {

  }

  const cancelHandler = () => {
    setVisibleState('list');
  }

  const responseUpdate = (resp) => {
    setVisibleState('list');
    setMessage(resp);
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
          <h1 className="mt-5">{editingSectionTitle}</h1>
        </div>

        <div className="container marketing" style={{ marginTop: '40px', marginBottom: '80px' }}>
          <div className="row">
            <div className="col-md-12">

              <TabularData
                data={tabularData.data}
                total={tabularData.total}
                per_page={tabularData.per_page}
                current_page={tabularData.current_page}
                admin="1"
                keyword=""
                makeHttpRequestWithPage={(page) => makeHttpRequestWithPage(page)}
                editHandler={(item, index, editingSection) => editHandler(item, index, editingSection)}
              />

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

      <div className="FooterAlert">
        <div className={`alert alert-${message.type}`} role="alert">{message.value} </div>
      </div>

    </div>
  );
};

export default CategoryItemList;
