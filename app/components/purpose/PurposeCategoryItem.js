import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router';

import { getName } from 'utils/DataUtils';

class PurposeCategoryItem extends Component {
  render() {
    const { purpose } = this.props;

    return (
      <ListGroupItem key={purpose.id}>
        <Link to="/search" query={{ purpose: purpose.id }}>
          {_.capitalize(getName(purpose))}
        </Link>
      </ListGroupItem>
    );
  }
}

PurposeCategoryItem.propTypes = {
  purpose: PropTypes.object.isRequired,
};

export default PurposeCategoryItem;
