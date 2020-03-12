import React from 'react';

import LoaderImg from '../../assets/images/loader1.gif';
// import LoaderImg from '../../assets/images/loader2.gif';
// import LoaderImg from '../../assets/images/loader3.gif';

const Loader = props => {

  let width = 30;
  if (props.width) {
    width = props.width;
  }

  return (
    <img className="Loader" src={LoaderImg} width={`${width}px`} alt="Loading.." />
  )
}

export default Loader;
