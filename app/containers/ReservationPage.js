import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import DocumentTitle from 'react-document-title';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { bindActionCreators } from 'redux';

import { fetchResource } from 'actions/resourceActions';
import ResourceHeader from 'components/resource/ResourceHeader';
import { resourcePageSelectors } from 'selectors/resourcePageSelectors';
import {
  getAddressWithName,
  getName,
} from 'utils/DataUtils';

export class UnconnectedReservationPage extends Component {
  componentDidMount() {
    const { actions, id } = this.props;
    actions.fetchResource(id);
  }

  render() {
    const { id, resource, unit } = this.props;
    const resourceName = getName(resource);

    return (
      <DocumentTitle title={`${resourceName} varaaminen - Respa`}>
        <Loader loaded={!_.isEmpty(resource)}>
          <div>
            <LinkContainer to={`/resources/${id}`}>
              <Button
                bsSize="large"
                bsStyle="primary"
                style={{ float: 'right' }}
              >
                Tilan tiedot
              </Button>
            </LinkContainer>
            <ResourceHeader
              address={getAddressWithName(unit)}
              name={resourceName}
            />
          <h2>Varaa tila</h2>
          </div>
        </Loader>
      </DocumentTitle>
    );
  }
}

UnconnectedReservationPage.propTypes = {
  actions: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  resource: PropTypes.object.isRequired,
  unit: PropTypes.object.isRequired,
};

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators({ fetchResource }, dispatch) };
}

export default connect(resourcePageSelectors, mapDispatchToProps)(UnconnectedReservationPage);
