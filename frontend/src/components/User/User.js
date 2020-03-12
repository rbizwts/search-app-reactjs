import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { LIMIT_RECORDS_ADMIN } from '../../config/constants';
import axios from '../../config/axios';
import Header from '../../containers/Admin/Header/Header';
import Footer from '../../containers/Admin/Footer/Footer';
import TabularData from '../../containers/TabularData/TabularData';
import UserForm from '../UserForm/UserForm';

const User = props => {

  const tableColumns = [
    { title: 'Name', columnName: 'name' },
    { title: 'Email', columnName: 'email' }
  ];

  const [viewType, setViewType] = useState('list');
  const [userData, setUserData] = useState({ id: 'new' });
  const [itemIndex, setItemIndex] = useState(0);
  const [message, setMessage] = useState({ type: '', value: '' });

  const [tabularData, setTabularData] = useState({ data: null, total: null, per_page: LIMIT_RECORDS_ADMIN, current_page: 1 })

  useEffect(() => {
    console.log("USEEFFECT COMPONENT USER.JS")
    makeHttpRequestWithPage(1);

    if (message.type !== "") {
      const timeout = setTimeout(() => {
        setMessage({ type: '', value: '' })
        clearTimeout(timeout);
      }, 6000)
    }

  }, [message])

  const makeHttpRequestWithPage = pageNumber => {
    axios.get('users', {
      params: {
        per_page: LIMIT_RECORDS_ADMIN,
        current_page: pageNumber
      }
    }).then(response => {
      // console.log(response);
      setTabularData({
        data: response.data.rows,
        total: response.data.count,
        per_page: LIMIT_RECORDS_ADMIN,
        current_page: pageNumber,
      });
    }).catch(error => {
      console.log(error);
    })
  }

  const createhandler = () => {
    setUserData({ id: 'new' });
    setViewType('create')
  }

  const editHandler = (index, item) => {
    setUserData(item)
    setItemIndex(index)
    setViewType('update')
  }

  const cancelHandler = (index, item) => {
    setViewType('list')
  }

  const deleteHandler = (index, item) => {

    if (window.confirm("Are you sure you want to delete user?")) {

      axios.delete("/users/" + item.id, {
        headers: { Authorization: `Bearer ${props.token}` }
      }).then(response => {
        console.log("DELETE SUCCESS")
        // console.log(response)
        setMessage({ type: 'warning', value: 'Item deleted successfully' })

        const newTableData = {
          ...tabularData
        };
        delete newTableData.data[index];
        setTabularData(newTableData)
        // console.log(newTableData);
        // setUpdateIndex({action: 'delete', index: index, data: null})
      }).catch(error => {
        console.log("DELETE ERROR")
        console.log(error)
        setMessage({ type: 'danger', value: 'Something went wrong, while deleteing' })
      })
    }
  }

  const responseUpdate = (resp) => {

    setMessage(resp);

  }

  const updateHandler = (index, item) => {
    let newTableData;
    if (index === "new") {
      let tableData = [
        ...tabularData.data
      ]

      tableData.unshift(item);

      newTableData = {
        ...tabularData,
        data: [
          ...tableData
        ]
      }
    } else {
      newTableData = {
        ...tabularData,
      }
      newTableData.data[index] = item;
    };
    setTabularData(newTableData)
    setViewType('list')
  }

  let opacityClass = '';
  if (viewType !== 'list') {
    opacityClass = 'custom-opacity-2';
  }

  return (

    <div>

      {
        viewType === 'create' || viewType === 'update' ?
          <UserForm defaultValue={userData} itemIndex={itemIndex} cancelHandler={cancelHandler} updateHandler={(index, item) => updateHandler(index, item)} responseUpdate={responseUpdate} />
          : null
      }

      <div className={opacityClass}>

        <Header />

        <div className="container py-5">
          <h1 className="mt-5">
            Users
          <span className="btn btn-dark float-right pointercursor" style={{ marginTop: '8px' }} onClick={() => createhandler()}>Create</span>
          </h1>

          <div className="mt-5 mb-5">

            <TabularData
              tableColumns={tableColumns}
              tabularData={tabularData}
              isAdmin="1"
              makeHttpRequestWithPage={(page) => makeHttpRequestWithPage(page)}
              editHandler={(index, item) => editHandler(index, item)}
              deleteHandler={(index, item) => deleteHandler(index, item)}
            />
          </div>

        </div>

        <Footer />
      </div>
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

export default connect(mapStateToProps)(User);
