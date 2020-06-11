import PropTypes from 'prop-types';
import React from 'react';

import GroupInfo from './group-info/GroupInfo';

Sidebar.propTypes = {
  date: PropTypes.string.isRequired,
  groups: PropTypes.arrayOf(
    PropTypes.shape({ name: PropTypes.string.isRequired })
  ).isRequired,
  selectedResourceId: PropTypes.string,
};
export default function Sidebar(props) {
  const { date } = props;
  return (
    <div className="sidebar">
      {props.groups.map((group) => (
        <GroupInfo
          date={date}
          key={group.name}
          selectedResourceId={props.selectedResourceId}
          {...group}
        />
      ))}
    </div>
  );
}
