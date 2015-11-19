import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { ListGroup, Panel } from 'react-bootstrap';

import PurposeCategoryItem from 'components/purpose/PurposeCategoryItem';
import { getName } from 'utils/DataUtils';

class PurposeCategoryList extends Component {
  renderPurposeCategoryItem(purpose) {
    return (
      <PurposeCategoryItem
        key={purpose.id}
        purpose={purpose}
      />
    );
  }

  render() {
    const { category, purposes } = this.props;

    return (
      <Panel
        collapsible
        header={getName(category)}
      >
        <ListGroup fill>
          {_.map(purposes, this.renderPurposeCategoryItem)}
        </ListGroup>
      </Panel>
    );
  }
}

PurposeCategoryList.propTypes = {
  category: PropTypes.object.isRequired,
  purposes: PropTypes.array.isRequired,
};

export default PurposeCategoryList;
