import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchReservations } from 'actions/reservationActions';
import { fetchResources } from 'actions/resourceActions';
import { fetchUnits } from 'actions/unitActions';
import ReservationsTable from 'components/reservation/ReservationsTable';
import userReservationsPageSelector from 'selectors/containers/userReservationsPageSelector';

export class UnconnectedUserReservationsPage extends Component {
  componentDidMount() {
    this.props.actions.fetchResources();
    this.props.actions.fetchUnits();
    this.props.actions.fetchReservations();
  }

  render() {
    const {
      isFetchingReservations,
      reservations,
      resources,
      units,
    } = this.props;

    return (
      <DocumentTitle title="Omat varaukset - Respa">
        <div>
          <h1>Omat varaukset</h1>
          <ReservationsTable
            isFetching={isFetchingReservations}
            reservations={reservations}
            resources={resources}
            units={units}
          />
        </div>
      </DocumentTitle>
    );
  }
}

UnconnectedUserReservationsPage.propTypes = {
  actions: PropTypes.object.isRequired,
  isFetchingReservations: PropTypes.bool.isRequired,
  reservations: PropTypes.array.isRequired,
  resources: PropTypes.object.isRequired,
  units: PropTypes.object.isRequired,
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
