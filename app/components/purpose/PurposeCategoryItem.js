import capitalize from 'lodash/capitalize';
import React, { Component, PropTypes } from 'react';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import { Link } from 'react-router';

import { getName } from 'utils/DataUtils';
import { getSearchPageUrl } from 'utils/SearchUtils';

class PurposeCategoryItem extends Component {
  render() {
    const { purpose } = this.props;

    return (
      <ListGroupItem key={purpose.id}>
        <Link to={getSearchPageUrl({ purpose: purpose.id })}>
          {capitalize(getName(purpose))}
        </Link>
      </ListGroupItem>
    );
  }
}

PurposeCategoryItem.propTypes = {
  purpose: PropTypes.object.isRequired,
};

export default PurposeCategoryItem;
