import React, { useState, useEffect } from 'react';

import './TabularData.css';

const TabularData = props => {

  // console.log('TABULARDATA.JS CALLED');

  const tableColumns = props.tableColumns;

  const [tableData, setTableData] = useState({ data: null, total: 0, per_page: 0, current_page: 0 })

  useEffect(() => {

    console.log("USEEFFECT TABULARDATA.JS")
    // console.log(props.tabularData)
    setTableData(props.tabularData)

  }, [props.tabularData])

  const pageNumbers = [];
  let renderPageNumbers
  let previousNum = 1;
  let nextNum = 1;

  if (tableData.total !== null) {
    for (let i = 1; i <= Math.ceil(tableData.total / tableData.per_page); i++) {
      pageNumbers.push(i);
    }

    let i = (tableData.current_page - 1);
    let currentIndex = (tableData.current_page - 1);
    let pageLength = pageNumbers.length

    previousNum = pageNumbers[i === 0 ? 0 : i - 1];
    nextNum = pageNumbers[i === (pageLength - 1) ? (pageLength - 1) : i + 1];

    let prevItem = null;
    renderPageNumbers = pageNumbers.map((number, index) => {
      let active_number = number === tableData.current_page ? 'active' : null

      if ((index > (currentIndex - 2) && index <= (currentIndex + 2)) || (pageLength - 1 === index) || index === 0) {
        prevItem = 'exist'
        return (<li key={number} className={`page-item ${active_number}`}>
          <span className="page-link pointercursor" onClick={() => props.makeHttpRequestWithPage(number)}>{number}</span>
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

  let prevClass = tableData.current_page === 1 ? 'active disabled' : null;
  let lastClass = tableData.current_page === pageNumbers[(pageNumbers.length) - 1] ? 'active disabled' : null;
  let srNo = tableData.current_page === 1 ? 0 : ((tableData.current_page - 1) * tableData.per_page)

  return (
    <div className="" style={{marginBottom: '100px'}}>

      <table className="table table-bordered">
        {props.isAdmin === "1" ? <thead>
          <tr>
            <th scope="col">#</th>
            {tableColumns.map((item, index) => {
              return <th scope="col" key={index}>{item.title}</th>
            })}
            <th scope="col"></th>
            {props.isAdmin === "1" ? <th scope="col"></th> : null}
          </tr>
        </thead> : null}
        <tbody>
          {tableData.data !== null ?
            tableData.data.map((item, index) => {
              srNo = srNo + 1;
              return <tr key={index}>
                <th scope="row">{srNo}</th>
                {tableColumns.map((col, key) => {
                  return <td key={key}>{(item && item[col.columnName]) ? item[col.columnName] : null}</td>
                })}
                <td style={{ width: '10%' }}><span className="btn btn-sm btn-warning pointercursor" onClick={() => props.editHandler(index, item)}>Edit</span></td>
                {props.isAdmin === "1" ? <td style={{ width: '10%' }}><span className="btn btn-sm btn-danger pointercursor" onClick={() => props.deleteHandler(index, item)}>Delete</span></td> : null}
              </tr>
            })
            : null}
        </tbody>
      </table>

      {
        tableData.data !== null && tableData.data.length > 0 && pageNumbers.length > 1 ?
          (<nav aria-label="Page navigation example">
            <ul className="pagination pagination-sm justify-content-end">
              <li className={`page-item ${prevClass}`}>
                <span className="page-link pointercursor" aria-label="Previous" onClick={() => props.makeHttpRequestWithPage(previousNum)}>
                  <span aria-hidden="true">&laquo;</span>
                </span>
              </li>
              {renderPageNumbers}
              <li className={`page-item ${lastClass}`}>
                <span className="page-link pointercursor" aria-label="Next" onClick={() => props.makeHttpRequestWithPage(nextNum)}>
                  <span aria-hidden="true">&raquo;</span>
                </span>
              </li>
            </ul>
          </nav>)
          : tableData.data !== null && tableData.data.length > 0 ? null : 'No content added'
      }
    </div>
  )
}

export default TabularData;
