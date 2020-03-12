import React from 'react';

const FooterAlert = props => {
  return (
    <div className="FooterAlert">
      <div className={`alert alert-${props.type}`} role="alert">{props.value} </div>
    </div>
  );
};

export default FooterAlert;
