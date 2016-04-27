import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchReservations } from 'actions/reservationActions';
import { fetchResources } from 'actions/resourceActions';
import { fetchUnits } from 'actions/unitActions';
import ReservationCancelModal from 'containers/ReservationCancelModal';
import ReservationDeleteModal from 'containers/ReservationDeleteModal';
import ReservationInfoModal from 'containers/ReservationInfoModal';
import ReservationsList from 'containers/ReservationsList';
import userReservationsPageSelector from 'selectors/containers/userReservationsPageSelector';

export class UnconnectedUserReservationsPage extends Component {
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

  render() {
    const { isAdmin, resourcesLoaded } = this.props;

    return (
      <DocumentTitle title="Omat varaukset - Varaamo">
        <Loader loaded={resourcesLoaded}>
          <div>
            { !isAdmin && (
              <div>
                <h1>Omat varaukset</h1>
                <ReservationsList />
              </div>
            )}
            { isAdmin && (
              <div>
                <h1>Alustavat varaukset</h1>
                <ReservationsList
                  emptyMessage="Ei alustavia varauksia näytettäväksi."
                  filter="preliminary"
                  />
                <h1>Tavalliset varaukset</h1>
                <ReservationsList
                  emptyMessage="Ei tavallisia varauksia näytettäväksi."
                  filter="regular"
                />
              </div>
            )}
            <ReservationCancelModal />
            <ReservationDeleteModal />
            <ReservationInfoModal />
          </div>
        </Loader>
      </DocumentTitle>
    );
  }
}

UnconnectedUserReservationsPage.propTypes = {
  actions: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  resourcesLoaded: PropTypes.bool.isRequired,
};

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    fetchReservations,
    fetchResources,
    fetchUnits,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export default connect(userReservationsPageSelector, mapDispatchToProps)(UnconnectedUserReservationsPage);
