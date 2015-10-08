import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { ListGroupItem } from 'react-bootstrap';

import { getName } from 'utils/DataUtils';

export class PurposeCategoryItem extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    event.preventDefault();
    this.props.onItemClick(this.props.purpose.id);
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
