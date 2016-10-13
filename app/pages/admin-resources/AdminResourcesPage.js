import React, { Component, PropTypes } from 'react';
import 'moment/locale/fi';
import moment from 'moment';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchFavoritedResources } from 'actions/resourceActions';
import PageWrapper from 'pages/PageWrapper';
import adminResourcesPageSelector from './adminResourcesPageSelector';
import ResourcesTable from './resources-table';

export class UnconnectedAdminResourcesPage extends Component {
  componentDidMount() {
    const now = moment();
    this.props.actions.fetchFavoritedResources(now, 'adminResourcesPage');
  }

  render() {
    const {
      isAdmin,
      isFetchingResources,
      resources,
    } = this.props;
    return (
      <PageWrapper title="Omat tilat">
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
      </PageWrapper>
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
    fetchFavoritedResources,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default (
  connect(adminResourcesPageSelector, mapDispatchToProps)(UnconnectedAdminResourcesPage)
);
