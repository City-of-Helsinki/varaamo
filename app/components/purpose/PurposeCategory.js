import map from 'lodash/collection/map';
import React, { Component, PropTypes } from 'react';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import Panel from 'react-bootstrap/lib/Panel';

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
          {map(purposes, this.renderPurposeCategoryItem)}
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
