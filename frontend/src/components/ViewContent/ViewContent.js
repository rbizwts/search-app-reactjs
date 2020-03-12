import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'

import axios from '../../config/axios';
import './ViewContent.css';

const ViewContent = props => {

  // let current_page = 1;
  // if (props.updateCurrent && props.updateCurrent == 0) {
  //   current_page = props.updateCurrent;
  // }

  const [paginationData, setPaginationData] = useState({ data: null, total: null, per_page: props.per_page, current_page: 1 })

  useEffect(() => {
    console.log("USE EFFECT VIEWCONTENT COMPONENT.JS");
    // console.log("current_page: ", props.updateCurrent);
    if (props.updateCurrent && props.updateCurrent === "a") {
      makeHttpRequestWithPage(paginationData.current_page)
    } else {
      makeHttpRequestWithPage(1)
    }
  }, [props.updateCurrent])

  const makeHttpRequestWithPage = pageNumber => {

    console.log("pageNumber: ", pageNumber);
    // props.updateCurrent = pageNumbers;
    // console.log("current_page makeHttpRequestWithPage: ", props.updateCurrent);

    axios.get('catalogue/page-search', {
      params: {
        keyword: props.keyword,
        admin: props.admin ? 1 : 0,
        category: props.editingSection,
        per_page: paginationData.per_page,
        current_page: pageNumber
      }
    }).then(response => {
      // console.log(response);
      setPaginationData({
        data: response.data.rows,
        total: response.data.count,
        per_page: paginationData.per_page,
        current_page: pageNumber,
      });
    }).catch(error => {
      console.log(error);
    })
  }

  // console.log(props);

  const pageNumbers = [];
  let renderPageNumbers
  let previousNum = 1;
  let nextNum = 1;
  if (paginationData.total !== null) {
    for (let i = 1; i <= Math.ceil(paginationData.total / paginationData.per_page); i++) {
      pageNumbers.push(i);
    }

    // console.log("pageNumbers: ", pageNumbers);
    let i = (paginationData.current_page - 1);
    let currentIndex = (paginationData.current_page - 1);
    let pageLength = pageNumbers.length
    // let currentNum = pageNumbers[i];
    previousNum = pageNumbers[i === 0 ? 0 : i - 1];
    nextNum = pageNumbers[i === (pageLength - 1) ? (pageLength - 1) : i + 1];

    let prevItem = null;
    renderPageNumbers = pageNumbers.map((number, index) => {
      let active_number = number === paginationData.current_page ? 'active' : null

      if ((index > (currentIndex - 2) && index <= (currentIndex + 2)) || (pageLength - 1 === index) || index === 0) {
        prevItem = 'exist'
        return (<li key={number} className={`page-item ${active_number}`}>
          <span className="page-link pointercursor" onClick={() => makeHttpRequestWithPage(number)}>{number}</span>
        </li>)
      } else {
        if (prevItem !== '..') {
          // pageItem = null
          prevItem = '..';
          return (<li key={number} className="page-item disabled">
            <span className="page-link">..</span>
          </li>)
        } else {
          prevItem = '..';
          return null;
        }
      }
    });
  }

  let prevClass = paginationData.current_page === 1 ? 'active disabled' : null;
  let lastClass = paginationData.current_page === pageNumbers[(pageNumbers.length) - 1] ? 'active disabled' : null;
  let srNo = paginationData.current_page === 1 ? 0 : ((paginationData.current_page - 1) * paginationData.per_page)

  return (
    <div className="">

      <table className="table table-bordered">
        {props.admin === "1" ? <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Description</th>
            <th scope="col">Tags</th>
            <th scope="col">Is Tag Search?</th>
            <th scope="col"></th>
            {props.isAuthenticated === true ? <th scope="col"></th> : null}
          </tr>
        </thead> : null}
        <tbody>
          {paginationData.data !== null ?
            paginationData.data.map((item, index) => {
              srNo = srNo + 1;
              return <tr key={index}>
                <th scope="row">{srNo}</th>
                <td>{item.description}</td>
                <td style={{ width: '20%' }}>{item.tags}</td>
                <td style={{ width: '10%' }}>{item.isTagSearchOnly}</td>
                <td style={{ width: '10%' }}><span className="btn btn-sm btn-warning pointercursor" onClick={() => props.editHandler(item, paginationData.current_page, props.editingSection)}>{props.isAuthenticated === true ? 'Edit' : 'View'}</span></td>
                {props.isAuthenticated === true ? props.admin === "1" ? <td style={{ width: '10%' }}><span className="btn btn-sm btn-danger pointercursor" onClick={() => props.deleteHandler(item, props.editingSection)}>Delete</span></td> : null : null}
              </tr>
            })
            : null}
        </tbody>
      </table>

      {
        paginationData.data !== null && paginationData.data.length > 0 && pageNumbers.length > 1 ?
          (<nav aria-label="Page navigation example">
            <ul className="pagination pagination-sm justify-content-end">
              <li className={`page-item ${prevClass}`}>
                <span className="page-link pointercursor" aria-label="Previous" onClick={() => makeHttpRequestWithPage(previousNum)}>
                  <span aria-hidden="true">&laquo;</span>
                </span>
              </li>
              {renderPageNumbers}
              <li className={`page-item ${lastClass}`}>
                <span className="page-link pointercursor" aria-label="Next" onClick={() => makeHttpRequestWithPage(nextNum)}>
                  <span aria-hidden="true">&raquo;</span>
                </span>
              </li>
            </ul>
          </nav>)
          : paginationData.data !== null && paginationData.data.length > 0 ? null : (<span style={{ marginLeft: '10px' }}>No content added.</span>)
      }
    </div>
  )
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null
  }
}

export default connect(mapStateToProps)(ViewContent);
