import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { ListGroup, Panel } from 'react-bootstrap';

import PurposeCategoryItem from 'components/purpose/PurposeCategoryItem';
import { humanizeMainType } from 'utils/DataUtils';

export class PurposeCategoryList extends Component {
  constructor(props) {
    super(props);
    this.renderPurposeCategoryItem = this.renderPurposeCategoryItem.bind(this);
  }

  renderPurposeCategoryItem(purpose) {
    return (
      <PurposeCategoryItem
        key={purpose.id}
        onItemClick={this.props.onItemClick}
        purpose={purpose}
      />
    );
  }

  render() {
    const { mainType, purposes } = this.props;

    return (
      <Panel
        collapsible
        defaultExpanded
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
  onItemClick: PropTypes.func.isRequired,
  purposes: PropTypes.array.isRequired,
};

export default PurposeCategoryList;
