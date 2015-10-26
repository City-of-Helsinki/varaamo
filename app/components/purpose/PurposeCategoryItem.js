import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { ListGroupItem } from 'react-bootstrap';

import { getName } from 'utils/DataUtils';

class PurposeCategoryItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    const searchFilters = { purpose: this.props.purpose.id };
    this.props.onItemClick(searchFilters);
  }

  render() {
    const { purpose } = this.props;

    return (
      <ListGroupItem key={purpose.id}>
        <a href="#" onClick={this.handleClick}>
          {_.capitalize(getName(purpose))}
        </a>
      </ListGroupItem>
    );
  }
}

PurposeCategoryItem.propTypes = {
  onItemClick: PropTypes.func.isRequired,
  purpose: PropTypes.object.isRequired,
};

export default PurposeCategoryItem;
