import React, { Component, PropTypes } from 'react';
import 'moment/locale/fi';
import moment from 'moment';
import DocumentTitle from 'react-document-title';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchResources } from 'actions/resourceActions';
import ResourcesTable from 'components/resource/ResourcesTable';
import adminResourcesPageSelector from 'selectors/containers/adminResourcesPageSelector';

export class UnconnectedAdminResourcesPage extends Component {
  componentDidMount() {
    const now = moment();
    this.props.actions.fetchResources({
      end: now.endOf('day').toISOString(),
      start: now.startOf('day').toISOString(),
    }, 'adminResourcesPage');
  }

  render() {
    const {
      isAdmin,
      isFetchingResources,
      resources,
    } = this.props;
    return (
      <DocumentTitle title="Omat tilat - Varaamo">
        <div>
          <h1>Omat tilat</h1>
          <Loader loaded={!isFetchingResources}>
            { isAdmin ?
              <ResourcesTable
                emptyMessage="Sinulla ei vielä ole yhtään omia tiloja näytettäväksi"
                resources={resources}
              /> :
              <p>Tarvitset virkailijan oikeudet nähdäksesi tämän sivun.</p>
            }
          </Loader>
        </div>
      </DocumentTitle>
    );
  }
}

UnconnectedAdminResourcesPage.propTypes = {
  actions: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isFetchingResources: PropTypes.bool.isRequired,
  resources: PropTypes.array.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    fetchResources,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default (
  connect(adminResourcesPageSelector, mapDispatchToProps)(UnconnectedAdminResourcesPage)
);
