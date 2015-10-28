import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { ListGroup, Panel } from 'react-bootstrap';

import PurposeCategoryItem from 'components/purpose/PurposeCategoryItem';
import { humanizeMainType } from 'utils/DataUtils';

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
    const { mainType, purposes } = this.props;

    return (
      <Panel
        collapsible
        header={humanizeMainType(mainType)}
      >
        <ListGroup fill>
          {_.map(purposes, this.renderPurposeCategoryItem)}
        </ListGroup>
      </Panel>
    );
  }
}

PurposeCategoryList.propTypes = {
  mainType: PropTypes.string.isRequired,
  purposes: PropTypes.array.isRequired,
};

export default PurposeCategoryList;
