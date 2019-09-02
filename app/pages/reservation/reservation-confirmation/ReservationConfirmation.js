import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import {
  Col, Row, Well, Button
} from 'react-bootstrap';
import iconHome from 'hel-icons/dist/shapes/home.svg';
import get from 'lodash/get';
import camelCase from 'lodash/camelCase';
import Loader from 'react-loader';

import constants from '../../../constants/AppConstants';
import injectT from '../../../i18n/injectT';
import ReservationDate from '../../../shared/reservation-date/ReservationDate';
import { reservationMetadataFields } from '../constants';
import { getFiltersFromUrl } from '../../../../src/domain/search/utils';
import { getReservationDetail } from '../utils';

class ReservationConfirmation extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
  };

  state = {
    reservation: {},
    isFetching: false
  }

  componentDidMount() {
    this.setState({ isFetching: true });
    this.fetchReservation();
  }

  fetchReservation = () => {
    const { match: { params } } = this.props;
    getReservationDetail(params.reservationId).then(({ data }) => {
      this.setState({
        reservation: data,
        isFetching: false
      });
    });
  }

  handleReservationsButton() {
    this.props.history.replace('/my-reservations');
  }

  renderMetaDataFields() {
    const { reservation } = this.state;
    const { t } = this.props;

    return (
      reservationMetadataFields.map((field) => {
        const value = get(reservation, field);

        return value ? (
          <Row
            className="app-ReservationConfirmation__field"
            key={`reservation-confirmation-field-${field}`}
          >
            <Col xs={6}>
              <b>{t(`${camelCase(field)}Label`)}</b>
            </Col>
            <Col className="app-ReservationConfirmation__field-value" xs={6}>
              {value}
            </Col>
          </Row>
        ) : '';
      })
    );
  }

  render() {
    const {
      t, location
    } = this.props;

    const { reservation, isFetching } = this.state;

    const isEdited = getFiltersFromUrl(location).isEdited;
    const href = `${constants.FEEDBACK_URL}?ref=${location.pathname}`;
    const resourceName = get(reservation, 'resource.name', '');

    return (
      <div className="app-ReservationConfirmation">
        <Loader loaded={!isFetching}>
          <Row>
            <Col md={6} xs={12}>
              <Well>
                <h2 className="app-ReservationPage__header">
                  {t(`ReservationConfirmation.reservation${isEdited ? 'Edited' : 'Created'}Title`)}
                </h2>
                <ReservationDate beginDate={reservation.begin} endDate={reservation.end} />
                <p className="app-ReservationConfirmation__resource-name">
                  <img
                    alt={resourceName}
                    className="app-ReservationConfirmation__icon"
                    src={iconHome}
                  />
                  <b>{resourceName}</b>
                </p>
                {!isEdited && (
                <p>
                  <FormattedHTMLMessage
                    id="ReservationConfirmation.confirmationText"
                    values={{ email: reservation.reserverEmail }}
                  />
                </p>
                )}
                <p>
                  <FormattedHTMLMessage id="ReservationConfirmation.feedbackText" values={{ href }} />
                </p>
                <p className="app-ReservationConfirmation__button-wrapper">
                  <Button
                    bsStyle="primary"
                    className="app-ReservationConfirmation__button"
                    onClick={() => this.handleReservationsButton()}
                  >
                    {t('ReservationConfirmation.ownReservationButton')}
                  </Button>
                </p>
              </Well>
            </Col>
            <Col md={6} xs={12}>
              <Well>
                <h2>{t('ReservationConfirmation.reservationDetailsTitle')}</h2>
                {this.renderMetaDataFields()}
              </Well>
            </Col>
          </Row>
        </Loader>
      </div>

    );
  }
}

export default injectT(ReservationConfirmation);
