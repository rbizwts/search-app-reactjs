import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import { LIMIT_RECORDS_ADMIN, sectionsTitle } from '../../config/constants';
import axios from '../../config/axios';
import Header from '../../containers/Admin/Header/Header';
import Loader from '../Loader/Loader'
import Footer from '../../containers/Admin/Footer/Footer';
import SubHeader from '../../containers/Admin/SubHeader/SubHeader';
import TabularData from '../../containers/TabularData/TabularData';
import CategoryForm from '../CategoryForm/CategoryForm';

const CategoryItem = props => {

  const tableColumns = [
    { title: 'Description', columnName: 'description' },
    { title: 'Tags', columnName: 'tags' },
    { title: 'Tag Search Only', columnName: 'isTagSearchOnly' }
  ];

  let c, editingSection, editingSectionTitle;
  for (c in sectionsTitle) {
    if (sectionsTitle[c].url === props.match.params.id) {
      editingSection = c;
      editingSectionTitle = c
    }
  }

  const [searchInput, setsearchInput] = useState('');
  const [viewType, setViewType] = useState('list');
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState({ id: 'new' });
  const [itemIndex, setItemIndex] = useState(0);
  const [message, setMessage] = useState({ type: '', value: '' });
  const [tabularData, setTabularData] = useState({ data: null, total: null, per_page: LIMIT_RECORDS_ADMIN, current_page: 1 })

  useEffect(() => {
    console.log("USEEFFECT COMPONENT CATEGORY ITEM.JS")
    makeHttpRequestWithPage(1);
  }, [editingSection])

  const makeHttpRequestWithPage = pageNumber => {

    setIsLoading(true)
    axios.get('catalogue/admin', {
      params: {
        category: editingSection,
        per_page: LIMIT_RECORDS_ADMIN,
        current_page: pageNumber,
        search_input: searchInput
      }
    }).then(response => {
      // console.log(response.data);
      setTabularData({
        data: response.data.rows,
        total: response.data.count,
        per_page: LIMIT_RECORDS_ADMIN,
        current_page: pageNumber,
      });
    }).catch(error => {
      console.log(error);
      setMessage({ type: 'danger', value: error.message })
      setTabularData({
        data: [],
        total: 0,
        per_page: LIMIT_RECORDS_ADMIN,
        current_page: pageNumber
      })
    }).then(() => {
      setIsLoading(false)
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
    if (window.confirm("Are you sure you want to delete category?")) {
      // console.log(index)
      // console.log(item)
      axios.delete("/catalogue/" + item.id, {
        headers: { Authorization: `Bearer ${props.token}` }
      }).then(response => {
        console.log("DELETE SUCCESS")
        // console.log(response)
        setMessage({ type: 'warning', value: 'Item deleted successfully' })

        const newTableData = {
          ...tabularData,
          // data: [
          //   ...tabularData.data
          // ]
        };
        delete newTableData.data[index];
        // Object.keys(newTableData.data).forEach(key => newTableData.data[key] === undefined ? delete newTableData.data[key] : '');


        // console.log("newTableData:", newTableData)
        setTabularData(newTableData)
      }).catch(error => {
        console.log("DELETE ERROR")
        console.log(error)
        setMessage({ type: 'danger', value: 'Something went wrong, while deleteing' })
      })
    }
  }

  const responseUpdate = (index, item) => {

  }

  const updateHandler = (index, item) => {
    let newTableData;

    // console.log(index)
    // console.log(item)

    if (index === "new") {
      // console.log('tabularData: ', tabularData);

      let tableData = [
        ...tabularData.data
      ]

      // console.log('tableData: ', tableData);

      tableData.unshift(item);

      // console.log('tableData after delete: ', tableData);

      newTableData = {
        ...tabularData,
        data: [
          ...tableData
        ]
      }

      console.log('newTableData 2: ', newTableData);
    } else {
      newTableData = {
        ...tabularData,
      }
      newTableData.data[index] = item;
    };
    setTabularData(newTableData)
    setViewType('list')
  }

  const searchHandler = (e) => {

    let searchValue = e.target.value.toLowerCase();
    // console.log("searchValue: ", searchValue);
    setIsLoading(true)
    setsearchInput(searchValue)

    if (searchValue === "") {
      setIsLoading(false)
      makeHttpRequestWithPage(1);
    } else {
      axios.get('catalogue/search-category', {
        params: {
          keyword: searchValue,
          category: editingSection,
          per_page: LIMIT_RECORDS_ADMIN,
          current_page: 1
        }
      }).then(function (response) {
        // console.log("response:: ", response)
        setTabularData({
          data: response.data.rows,
          total: response.data.count,
          per_page: LIMIT_RECORDS_ADMIN,
          current_page: 1,
        });

      }).catch(function (error) {
        console.log(error);
        setMessage({ type: 'danger', value: error.message })
        makeHttpRequestWithPage(1);
      }).then(function () {
        setIsLoading(false)
      });
    }
  }

  let opacityClass = '';
  if (viewType !== 'list') {
    opacityClass = 'custom-opacity-2';
  }

  return (

    <div>

      {
        viewType === 'create' || viewType === 'update' ?
          <CategoryForm defaultValue={userData} editingSection={editingSection} itemIndex={itemIndex} cancelHandler={cancelHandler} updateHandler={(index, item) => updateHandler(index, item)} responseUpdate={responseUpdate} />
          : null
      }

      <div className={opacityClass}>

        <Header />
        <SubHeader sectionsTitle={sectionsTitle} />

        <div className="container">
          <h1 className="mt-5">
            {editingSectionTitle}
            <span className="btn btn-dark float-right pointercursor" style={{ marginTop: '8px' }} onClick={() => createhandler()}>Create</span>
          </h1>

          <div className="navbar flex-md-nowrap p-0" style={{ margin: "50px 0 10px 0" }}>
            <input className="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search" value={searchInput} onChange={searchHandler} />
          </div>

          <div className="mb-5">
            {isLoading === true ? <Loader width="80" /> :
              <TabularData
                tableColumns={tableColumns}
                tabularData={tabularData}
                isAdmin="1"
                makeHttpRequestWithPage={(page) => makeHttpRequestWithPage(page)}
                editHandler={(index, item) => editHandler(index, item)}
                deleteHandler={(index, item) => deleteHandler(index, item)}
              />
            }
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

export default connect(mapStateToProps)(CategoryItem);
