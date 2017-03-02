import React, { PropTypes } from 'react';

import ResourceInfoContainer from './ResourceInfo';

GroupInfo.propTypes = {
  date: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  resources: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedResourceId: PropTypes.string,
};
export default function GroupInfo(props) {
  const date = props.date;
  return (
    <div className="group-info" title={props.name}>
      <div className="group-name"><div className="name">{props.name}</div></div>
      {props.resources.map(resource =>
        <ResourceInfoContainer
          date={date}
          id={resource}
          isSelected={resource === props.selectedResourceId}
          key={resource}
        />
      )}
    </div>
  );
}
