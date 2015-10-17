import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { bindActionCreators } from 'redux';

import { fetchResource } from 'actions/resourceActions';
import ResourceDetails from 'components/resource/ResourceDetails';
import ResourceHeader from 'components/resource/ResourceHeader';
import NotFoundPage from 'containers/NotFoundPage';
import { resourcePageSelectors } from 'selectors/resourcePageSelectors';
import {
  getAddressWithName,
  getDescription,
  getName,
  getPeopleCapacityString,
} from 'utils/DataUtils';

export class UnconnectedResourcePage extends Component {
  componentDidMount() {
    const { actions, id } = this.props;
    actions.fetchResource(id);
  }

  render() {
    const {
      id,
      isFetchingResource,
      resource,
      unit,
    } = this.props;
    const resourceName = getName(resource);

    if (_.isEmpty(resource) && !isFetchingResource) {
      return <NotFoundPage />;
    }

    return (
      <DocumentTitle title={`${resourceName} - Respa`}>
        <Loader loaded={!_.isEmpty(resource)}>
          <div>
            <LinkContainer to={`/resources/${id}/reservation`}>
              <Button
                bsSize="large"
                bsStyle="primary"
                style={{ float: 'right' }}
              >
                Varaa tila
              </Button>
            </LinkContainer>
            <ResourceHeader
              address={getAddressWithName(unit)}
              name={resourceName}
            />
            <ResourceDetails
              capacityString={getPeopleCapacityString(resource.peopleCapacity)}
              description={getDescription(resource)}
              type={getName(resource.type)}
            />
          </div>
        </Loader>
      </DocumentTitle>
    );
  }
}

UnconnectedResourcePage.propTypes = {
  actions: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  isFetchingResource: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    fetchResource,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(resourcePageSelectors, mapDispatchToProps)(UnconnectedResourcePage);
