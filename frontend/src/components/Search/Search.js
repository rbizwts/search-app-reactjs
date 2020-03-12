import React from 'react';

import './Search.css'
// import logo from '../../assets/images/earth-globe-with-continents-maps.png';

const Search = props => {
  return (
    <div className="search-centered">
      {/* <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text" id="basic-addon1">SEARCH</span>
          <img src={logo} alt="Logo" />
        </div> */}
        <input type="text" className="form-control search-input" placeholder="Start typing..." aria-label="Keyword" aria-describedby="basic-addon1" value={props.searchInput} onChange={(e) => props.searchHandler(e)} autoFocus />
      {/* </div> */}

      {/* <input type="text" className="form-control custom-input" placeholder="Keyword" aria-label="Keyword" aria-describedby="basic-addon1" value={props.searchInput} onChange={(e) => props.searchHandler(e)} /> */}
    </div>
  )
}

export default Search;
