import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchFavoritedResources } from 'actions/resourceActions';
import PageWrapper from 'pages/PageWrapper';
import { injectT } from 'i18n';
import adminResourcesPageSelector from './adminResourcesPageSelector';
import ResourcesTable from './resources-table';

class UnconnectedAdminResourcesPage extends Component {
  componentDidMount() {
    const now = moment();
    this.props.actions.fetchFavoritedResources(now, 'adminResourcesPage');
  }

  render() {
    const {
      isAdmin,
      isFetchingResources,
      resources,
      t,
    } = this.props;
    return (
      <PageWrapper className="admin-resources-page" title={t('AdminResourcesPage.title')}>
        <h1>{t('AdminResourcesPage.title')}</h1>
        <Loader loaded={!isFetchingResources}>
          {isAdmin && (
            Object.keys(resources).length ?
              <ResourcesTable resources={resources} />
            : <p>{t('ResourcesTable.emptyMessage')}</p>
          )}
          {!isAdmin && (
            <p>{t('AdminResourcesPage.noRightsMessage')}</p>
          )}
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
  t: PropTypes.func.isRequired,
};

UnconnectedAdminResourcesPage = injectT(UnconnectedAdminResourcesPage);  // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    fetchFavoritedResources,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedAdminResourcesPage };
export default (
  connect(adminResourcesPageSelector, mapDispatchToProps)(injectT(UnconnectedAdminResourcesPage))
);
