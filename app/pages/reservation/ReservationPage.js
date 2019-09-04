import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import ReservationEdit from './reservation-edit/ReservationEdit';
import { RESERVATION_PHASE } from './constants';
import { getReservationById, getResourceById } from './utils';

export default class ReservationPage extends Component {
  state = {
    isFetching: false,
    reservation: {},
    resource: {}
  }

  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.fetchReservation();
  }

  fetchReservation = async () => {
    const { match: { params } } = this.props;
    let resourceResponse;

    this.setState({ isFetching: true });
    const reservationResponse = await getReservationById(params.reservationId);
    if (reservationResponse) {
      resourceResponse = await getResourceById(reservationResponse.data.resource);
    }
    // TODO: Handle HTTP errors

    this.setState({
      resource: resourceResponse.data,
      reservation: reservationResponse.data,
      isFetching: false
    });
  }

  render() {
    return (
      <div className="app-ReservationPage">
        <Switch>
          <Route
            component={props => <ReservationEdit {...props} {...this.state} />}
            exact
            path={`/reservation/:reservationId/${RESERVATION_PHASE.EDIT}`}
          />

          {/* <Route
            component={ReservationConfirm}
            path="/confirm"
          />

          <Route
            component={ReservationInfomation}
            path="/information"
          /> */}
        </Switch>
      </div>
    );
  }
}
