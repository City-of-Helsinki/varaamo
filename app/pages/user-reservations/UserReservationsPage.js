import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchReservations } from 'actions/reservationActions';
import { fetchResources } from 'actions/resourceActions';
import { changeAdminReservationFilters } from 'actions/uiActions';
import { fetchUnits } from 'actions/unitActions';
import ReservationInfoModal from 'shared/modals/reservation-info';
import PageWrapper from 'pages/PageWrapper';
import ReservationCancelModal from 'shared/modals/reservation-cancel';
import { injectT } from 'i18n';
import userReservationsPageSelector from './userReservationsPageSelector';
import AdminReservationFilters from './reservation-filters/AdminReservationFilters';
import ReservationList from './reservation-list';

class UnconnectedUserReservationsPage extends Component {
  constructor(props) {
    super(props);
    this.handleFiltersChange = this.handleFiltersChange.bind(this);
  }

  componentDidMount() {
    this.adminReservationsLoaded = false;
    if (this.props.isAdmin) {
      this.props.actions.fetchReservations({ canApprove: true });
      this.adminReservationsLoaded = true;
    }
    this.props.actions.fetchResources();
    this.props.actions.fetchUnits();
    this.props.actions.fetchReservations({ isOwn: true });
  }

  componentWillReceiveProps(nextProps) {
    if (!this.adminReservationsLoaded && nextProps.isAdmin) {
      this.props.actions.fetchReservations({ canApprove: true });
      this.adminReservationsLoaded = true;
    }
  }

  handleFiltersChange(filters) {
    this.props.actions.changeAdminReservationFilters(filters);
    if (filters.state === 'all') {
      this.props.actions.fetchReservations({ canApprove: true });
    } else {
      this.props.actions.fetchReservations({ canApprove: true, state: filters.state });
    }
  }

  render() {
    const {
      adminReservationFilters,
      isAdmin,
      reservationsFetchCount,
      resourcesLoaded,
      t,
    } = this.props;

    return (
      <div className="app-UserReservationPage">
        <PageWrapper className="app-UserReservationPage__wrapper" title={t('UserReservationsPage.title')} transparent={false}>
          <Loader loaded={resourcesLoaded}>

            { !isAdmin && (
              <div>
                <h1>{t('UserReservationsPage.title')}</h1>
                <ReservationList
                  loading={reservationsFetchCount < 1}
                />
              </div>
            )}
            { isAdmin && (
              <div>
                <h1>{t('UserReservationsPage.title')}</h1>
                <AdminReservationFilters
                  filters={adminReservationFilters}
                  onFiltersChange={this.handleFiltersChange}
                />
                <ReservationList
                  emptyMessage={t('UserReservationsPage.preliminaryEmptyMessage')}
                  filter={adminReservationFilters.state}
                  loading={reservationsFetchCount < 2}
                />
                <h1>{t('UserReservationsPage.regularReservationsHeader')}</h1>
                <ReservationList
                  emptyMessage={t('UserReservationsPage.regularEmptyMessage')}
                  filter="regular"
                  loading={reservationsFetchCount < 1}
                />
              </div>
            )}
            <ReservationCancelModal />
            <ReservationInfoModal />
          </Loader>
        </PageWrapper>
      </div>
    );
  }
}

UnconnectedUserReservationsPage.propTypes = {
  actions: PropTypes.object.isRequired,
  adminReservationFilters: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  reservationsFetchCount: PropTypes.number.isRequired,
  resourcesLoaded: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};
UnconnectedUserReservationsPage = injectT(UnconnectedUserReservationsPage);  // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    changeAdminReservationFilters,
    fetchReservations,
    fetchResources,
    fetchUnits,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}


export { UnconnectedUserReservationsPage };
export default connect(userReservationsPageSelector, mapDispatchToProps)(
  UnconnectedUserReservationsPage
);
