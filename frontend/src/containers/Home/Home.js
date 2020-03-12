import React, { useState, useEffect } from 'react';
import axios from '../../config/axios';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { sectionsTitle } from "../../config/constants";
import './Home.css'
import Section from '../Section/Section';
import Search from '../../components/Search/Search';
import Loader from '../../components/Loader/Loader';
import ViewContent from '../ViewContent/ViewContent';
import ContentForm from '../../components/ContentForm/ContentForm';
import FooterAlert from '../../components/FooterAlert/FooterAlert';

const Layout = props => {

  const initialKeywordState = {
    id: 'new',
    keyword: '',
    INFO: [],
    DEFINITION: [],
    OTHERDETAILS: [],
    PROJECTS: [],
    QUESTIONS: [],
    TEAM: [],
  }

  const [isSearch, setIsSearch] = useState(true);
  const [visibleState, setVisibleState] = useState('search');
  const [isLoading, setIsLoading] = useState(false);
  const [editingSection, setEditingSection] = useState(0);
  const [searchInput, setsearchInput] = useState('');
  const [searchOutput, setSearchOutput] = useState(initialKeywordState);
  const [editItem, setEditItem] = useState({});
  const [message, setMessage] = useState({ type: '', value: '' });

  useEffect(() => {
    console.log("USEEFFECT MESSAGE")
    if (message.type !== "") {
      const timeout = setTimeout(() => {
        setMessage({ type: '', value: '' })
        clearTimeout(timeout);
      }, 3000)
    }
  }, [message])

  const searchHandler = (e) => {

    let searchValue = e.target.value.toLowerCase();
    // console.log("searchValue: ", searchValue);
    setIsLoading(true)
    setsearchInput(searchValue)

    if (searchValue === "") {
      // console.log("searchValue empty")
      setIsLoading(false)
      setSearchOutput(initialKeywordState);
    } else {
      axios.get('/catalogue/search', {
        params: {
          keyword: searchValue
        }
      }).then(function (response) {
        // console.log(response);
        let searchOutput = initialKeywordState;
        searchOutput.keyword = searchValue;
        response.data.forEach(raw => {
          // console.log(raw)
          // console.log(raw.category)

          // searchOutput['section_' + sectionsTitle[raw.category].key].push(raw)
          searchOutput[raw.category].push(raw)
        })
        // console.log(searchOutput);
        setSearchOutput(searchOutput);
      }).catch(function (error) {
        console.log(error);
        setMessage({ type: 'danger', value: error.message })
        setSearchOutput(initialKeywordState);
      }).then(function () {
        setIsLoading(false)
      });
    }
  }

  const editHandler = (data, index, section) => {
    // console.log('editHandler called', section);
    setEditingSection(section);
    setEditItem(data)
    setIsSearch(false)
    setVisibleState('edit')
  }

  const viewhandler = section => {
    setEditingSection(section);
    setIsSearch(false)
    setVisibleState('view')
  }

  const cancelHandler = () => {
    // console.log('editingSection: ', editingSection);
    setIsSearch(true)
    setVisibleState('search')
  }

  const closeHandler = () => {
    // console.log('editingSection: ', editingSection);
    setIsSearch(true)
    setVisibleState('search')
  }

  const actionHandler = (action, category) => {
    // console.log("Action: ", action, "Category: ", category);
    setVisibleState(action);
    setEditingSection(category);
    setIsSearch(false);
  }

  const updateHandler = (action, category, data) => {
    let categoryData = [
      ...searchOutput[category],
    ]
    if (action === "created") {
      categoryData.push(data);
    } else {
      // console.log("data: ", data)
      let objIndex = categoryData.findIndex((obj => obj.id === data.id));

      categoryData[objIndex] = data
    }

    const setSearchOutputVar = {
      ...searchOutput,
      [category]: categoryData
    };

    setIsSearch(true)
    setVisibleState('search')
    setSearchOutput(setSearchOutputVar)
  }

  const responseUpdate = (resp) => {
    // console.log(resp);
    setMessage(resp);
  }

  let category;
  const displaySections = []
  for (category in sectionsTitle) {
    let key = sectionsTitle[category].key;
    let title = sectionsTitle[category].title;
    let section_name = category;

    displaySections.push(
      <div key={key} className={`col-sm-4 third-half color${key}`}>
        {
          isLoading === true ?
            <Loader />
            :
            (
              <div>
                <Section searchInput={searchInput} sectionsTitle={sectionsTitle} category={category} title={title} isSearch={isSearch} visibleState={visibleState} section={key} sectionOutput={searchOutput[section_name]} actionHandler={(action, category) => actionHandler(action, category)} editHandler={(data, index, section) => editHandler(data, index, section)} viewhandler={() => viewhandler(key)} />
              </div>
            )
        }
      </div>
    )
  }

  let visibleType;
  let opacityClass = '';
  if (visibleState === 'search') {
    opacityClass = '';
    visibleType = <Search searchInput={searchInput} searchHandler={searchHandler} />
  } else if (visibleState === 'edit') {
    opacityClass = 'custom-opacity';
    visibleType = <ContentForm sectionsTitle={sectionsTitle} cancelHandler={cancelHandler} keyword={searchInput} editingSection={editingSection} updateHandler={updateHandler} defaultValue={editItem} responseUpdate={responseUpdate} />
  } else if (visibleState === 'view') {
    opacityClass = 'custom-opacity';
    visibleType = <ViewContent sectionsTitle={sectionsTitle} cancelHandler={cancelHandler} keyword={searchInput} editingSection={editingSection} editHandler={editHandler} closeHandler={closeHandler} defaultValue={searchOutput[editingSection]} responseUpdate={responseUpdate} />
  } else if (visibleState === 'add') {
    opacityClass = 'custom-opacity';
    // visibleType = <ContentAdd sectionsTitle={sectionsTitle} cancelHandler={cancelHandler} keyword={searchInput} editingSection={editingSection} closeHandler={closeHandler} defaultValue={{ id: 'new' }} updateHandler={updateHandler} responseUpdate={responseUpdate} />

    visibleType = <ContentForm sectionsTitle={sectionsTitle} cancelHandler={cancelHandler} keyword={searchInput} editingSection={editingSection} updateHandler={updateHandler} defaultValue={{ id: 'new' }} responseUpdate={responseUpdate} />
  }

  return (
    <div className="Home container-fluid">

      <div className="logoHeader">
        <a href="https://wingstechsolutions.com">WTS</a>
      </div>

      <div className="loginHeader">
        {props.isAuthenticated === false ?
          <NavLink to="/admin">Login</NavLink>
          :
          <div>
            <NavLink to="/admin/dashboard">Admin</NavLink>
            <NavLink to="/admin/logout">Logout</NavLink>
          </div>
        }
      </div>

      <div>
        <div className="">
          {visibleType}
        </div>
      </div>

      <div className={`row ${opacityClass}`}>

        {displaySections}

      </div>

      <FooterAlert type={message.type} value={message.value} />

    </div>
  )
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null
  }
}

export default connect(mapStateToProps)(Layout);
