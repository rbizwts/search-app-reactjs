import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Layout from './hoc/Layout/Layout'

import './App.css';

const App = () => {

  return (
    <div className="App">
      <BrowserRouter basename="/react-search-app">
        <Layout />
      </BrowserRouter>
    </div>
  );
}

export default App;
