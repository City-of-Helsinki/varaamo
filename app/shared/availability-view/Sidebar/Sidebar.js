import React, { PropTypes } from 'react';

import GroupInfo from './GroupInfo';

Sidebar.propTypes = {
  date: PropTypes.string.isRequired,
  groups: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string.isRequired })
  ).isRequired,
};
export default function Sidebar(props) {
  return (
    <div className="sidebar">
      {props.groups.map(group => <GroupInfo date={props.date} key={group.name} {...group} />)}
    </div>
  );
}
