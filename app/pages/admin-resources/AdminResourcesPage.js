import moment from 'moment';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchFavoritedResources } from 'actions/resourceActions';
import { changeAdminResourcesPageDate } from 'actions/uiActions';
import PageWrapper from 'pages/PageWrapper';
import AvailabilityView from 'shared/availability-view';
import { injectT } from 'i18n';
import adminResourcesPageSelector from './adminResourcesPageSelector';

class UnconnectedAdminResourcesPage extends Component {
  componentDidMount() {
    this.fetchResources(this.props.date);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.date !== this.props.date) {
      this.fetchResources(nextProps.date);
    }
  }

  componentWillUnmount() {
    this.props.actions.changeAdminResourcesPageDate(null);
  }

  fetchResources(date) {
    this.props.actions.fetchFavoritedResources(moment(date), 'adminResourcesPage');
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
            <AvailabilityView
              date={this.props.date}
              groups={[{ name: '', resources }]}
              onDateChange={this.props.actions.changeAdminResourcesPageDate}
            />
          )}
          {isAdmin && !resources.length && <p>{t('AdminResourcesPage.noResourcesMessage')}</p>}
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
  date: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isFetchingResources: PropTypes.bool.isRequired,
  resources: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
};

UnconnectedAdminResourcesPage = injectT(UnconnectedAdminResourcesPage);  // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    changeAdminResourcesPageDate,
    fetchFavoritedResources,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedAdminResourcesPage };
export default (
  connect(adminResourcesPageSelector, mapDispatchToProps)(injectT(UnconnectedAdminResourcesPage))
);
