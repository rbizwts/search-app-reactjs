import React from 'react';
import { NavLink } from 'react-router-dom';

import './SubHeader.css';

const SubHeader = props => {

  // console.log(props.sectionsTitle);

  let listCategory = []
  let category;
  for (category in props.sectionsTitle) {
    let key = props.sectionsTitle[category].key;
    let title = props.sectionsTitle[category].title;
    let url = props.sectionsTitle[category].url;
    listCategory.push(<NavLink className="nav-link pointercursor" to={`/admin/categories/${url}`} key={key} > {title}</NavLink >)
  }

  return (
    <div className="nav-scroller bg-white shadow-sm">
      <nav className="nav nav-underline">
        {/* <span className="nav-link active">Categories</span> */}
        {listCategory}
      </nav>
    </div>
  );
};

export default SubHeader;
