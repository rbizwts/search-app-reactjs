import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { sectionsTitle } from '../../../config/constants';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
// import CategoryImage from '../../../assets/images/blog-archetypes-1.jpg';

const Category = props => {
  console.log("--- ADMIN CATEGORY.JS ---")


  const colorsBg = ['#e91e63', '#2196F3', '#9c27b0', '#607d8b', '#4CAF50', '#FF9800']

  let listCategory = []
  let category;
  let i = 0;
  for (category in sectionsTitle) {
    // let key = sectionsTitle[category].key;
    let title = sectionsTitle[category].title;
    let url = sectionsTitle[category].url;
    listCategory.push(
      <div key={i} className="col-md-4">
        <div className="card mb-4 shadow-sm">
          <NavLink className="pointercursor" to={`/admin/categories/${url}`}>
            <svg className="bd-placeholder-img card-img-top" width="100%" height="150" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>{title.toUpperCase()}</title><rect width="100%" height="100%" fill={colorsBg[i]} /><text x="50%" y="50%" fill="#eceeef" dy=".3em">{title.toUpperCase()}</text></svg>
          </NavLink>
        </div>
      </div>
    )
    i++;
  }

  return (
    <div>
      <Header />

      <div className="container marketing py-5" style={{ marginTop: '80px', marginBottom: '80px' }}>

        <div className="row">

          {listCategory}

        </div>

      </div>

      <Footer />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null
  }
}

export default connect(mapStateToProps)(Category);
