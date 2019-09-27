import React from 'react';

function Tooltip (props) {
  const {showTooltip, mvalue, value} = props;

  if(!showTooltip) return null;
  return (
      <div className="userList-tooltip">
          {value || ''}
          {mvalue >= 0 && value !== mvalue && <span className="cerrectedTime">{' ' + mvalue}</span>}
      </div>
  )
}

export default Tooltip;