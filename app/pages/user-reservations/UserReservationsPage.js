import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchReservations } from '../../actions/reservationActions';
import { fetchResources } from '../../actions/resourceActions';
import { fetchUnits } from '../../actions/unitActions';
import ReservationInfoModal from '../../shared/modals/reservation-info/ReservationInfoModalContainer';
import PageWrapper from '../PageWrapper';
import ReservationCancelModal from '../../shared/modals/reservation-cancel/ReservationCancelModalContainer';
import injectT from '../../i18n/injectT';
import userReservationsPageSelector from './userReservationsPageSelector';
import ReservationList from './reservation-list/ReservationListContainer';
import { getFiltersFromUrl } from '../../../src/domain/search/utils';

const PAGE_SIZE = 10;

class UnconnectedUserReservationsPage extends Component {
  componentDidMount() {
    const { location } = this.props;
    const filters = getFiltersFromUrl(location, false);

    this.props.actions.fetchResources();
    this.props.actions.fetchUnits();
    this.props.actions.fetchReservations({
      all: true,
      isOwn: true,
      page: filters && filters.page ? Number(filters.page) : 1,
      pageSize: 10,
      ordering: '-begin'
    });
  }

  render() {
    const {
      reservationsFetchCount,
      resourcesLoaded,
      t,
    } = this.props;
    return (
      <div className="app-UserReservationPage">
        <PageWrapper
          className="app-UserReservationPage__wrapper"
          title={t('UserReservationsPage.title')}
          transparent={false}
        >
          <Loader loaded={resourcesLoaded}>
            <div>
              <h1>{t('UserReservationsPage.title')}</h1>
              <ReservationList
                fetchReservations={this.props.actions.fetchReservations}
                history={this.props.history}
                loading={reservationsFetchCount < 1}
                location={this.props.location}
                pageSize={PAGE_SIZE}
              />
            </div>
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
  history: PropTypes.object,
  location: PropTypes.object,
  reservationsFetchCount: PropTypes.number.isRequired,
  resourcesLoaded: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};
UnconnectedUserReservationsPage = injectT(UnconnectedUserReservationsPage);  // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
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
