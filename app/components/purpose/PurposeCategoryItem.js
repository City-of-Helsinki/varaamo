import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { ListGroupItem } from 'react-bootstrap';

import { getName } from 'utils/DataUtils';

export class PurposeCategoryItem extends Component {
  render() {
    const { purpose } = this.props;

    return (
      <ListGroupItem key={purpose.id}>
        {_.capitalize(getName(purpose))}
      </ListGroupItem>
    );
  }
}

PurposeCategoryItem.propTypes = {
  purpose: PropTypes.object.isRequired,
};

export default PurposeCategoryItem;
