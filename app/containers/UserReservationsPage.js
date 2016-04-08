import React, { Component, PropTypes } from 'react';
import DocumentTitle from 'react-document-title';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { fetchReservations } from 'actions/reservationActions';
import { fetchResources } from 'actions/resourceActions';
import { fetchUnits } from 'actions/unitActions';
import ReservationsList from 'containers/ReservationsList';
import userReservationsPageSelector from 'selectors/containers/userReservationsPageSelector';

export class UnconnectedUserReservationsPage extends Component {
  componentDidMount() {
    this.props.actions.fetchResources();
    this.props.actions.fetchUnits();
    this.props.actions.fetchReservations({ isOwn: true });
  }

  render() {
    const { isAdmin, isFetchingResources } = this.props;

    return (
      <DocumentTitle title="Omat varaukset - Varaamo">
        <Loader loaded={!isFetchingResources}>
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
          </div>
        </Loader>
      </DocumentTitle>
    );
  }
}

UnconnectedUserReservationsPage.propTypes = {
  actions: PropTypes.object.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isFetchingResources: PropTypes.bool.isRequired,
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
