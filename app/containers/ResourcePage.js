import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchResource } from 'actions/resourceActions';
import ResourceHeader from 'components/resource/ResourceHeader';
import { resourcePageSelectors } from 'selectors/resourcePageSelectors';
import {
  getAddressWithName,
  getDescription,
  getName,
  getType,
  getPeopleCapacityString,
} from 'utils/DataUtils';

export class UnconnectedResourcePage extends Component {
  componentDidMount() {
    const { actions, id } = this.props;
    actions.fetchResource(id);
  }

  render() {
    const { resource, unit } = this.props;
    const resourceName = getName(resource);

    return (
      <DocumentTitle title={`${resourceName} - Respa`}>
        <Loader loaded={!_.isEmpty(resource)}>
          <div>
            <ResourceHeader
              address={getAddressWithName(unit)}
              name={resourceName}
            />
            <p>{getType(resource)} {getPeopleCapacityString(resource.peopleCapacity)}</p>
            <p>{getDescription(resource)}</p>
          </div>
        </Loader>
      </DocumentTitle>
    );
  }
}

UnconnectedResourcePage.propTypes = {
  actions: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  resource: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ fetchResource }, dispatch) };
}

export default connect(resourcePageSelectors, mapDispatchToProps)(UnconnectedResourcePage);
