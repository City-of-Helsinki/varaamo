import pick from 'lodash/pick';
import uniq from 'lodash/uniq';
import camelCase from 'lodash/camelCase';
import get from 'lodash/get';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import moment from 'moment';

import injectT from '../../../i18n/injectT';
import { isStaffEvent, getReservationPrice, getReservationPricePerPeriod } from '../../../utils/reservationUtils';
import { getTermsAndConditions, hasProducts } from '../../../utils/resourceUtils';
import ReservationInformationForm from './ReservationInformationForm';
import apiClient from '../../../../src/common/api/client';

class ReservationInformation extends Component {
  static propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isMakingReservations: PropTypes.bool.isRequired,
    isStaff: PropTypes.bool.isRequired,
    onBack: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    reservation: PropTypes.object,
    resource: PropTypes.object.isRequired,
    selectedTime: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    unit: PropTypes.object.isRequired
  };

  state = {
    reservationPrice: null,
  }

  componentDidMount() {
    if (!hasProducts(this.props.resource)) {
      return;
    }
    const products = get(this.props.resource, 'products');
    const {
      begin,
      end,
    } = this.props.selectedTime;

    getReservationPrice(apiClient, begin, end, products)
      .then(price => this.setState({ reservationPrice: price }))
      .catch(() => this.setState({ reservationPrice: null }));
  }

  onConfirm = (values) => {
    const { onConfirm } = this.props;
    onConfirm(values);
  }

  getFormFields = (termsAndConditions) => {
    const {
      isAdmin,
      isStaff,
      resource,
    } = this.props;
    const formFields = [...resource.supportedReservationExtraFields].map(value => camelCase(value));

    if (isAdmin) {
      formFields.push('comments');

      /* waiting for backend implementation */
      // formFields.push('reserverName');
      // formFields.push('reserverEmailAddress');
      // formFields.push('reserverPhoneNumber');
    }

    if (resource.needManualConfirmation && isStaff) {
      formFields.push('staffEvent');
    }

    if (termsAndConditions) {
      formFields.push('termsAndConditions');
    }

    if (hasProducts(resource)) {
      formFields.push('paymentTermsAndConditions');
      formFields.push('billingFirstName');
      formFields.push('billingLastName');
      formFields.push('billingPhoneNumber');
      formFields.push('billingEmailAddress');
    }


    return uniq(formFields);
  }

  getFormInitialValues = () => {
    const {
      isEditing,
      reservation,
      resource,
    } = this.props;
    let rv = reservation ? pick(reservation, this.getFormFields()) : {};
    if (isEditing) {
      rv = { ...rv, staffEvent: isStaffEvent(reservation, resource) };
    }
    return rv;
  }

  getRequiredFormFields(resource, termsAndConditions) {
    const requiredFormFields = [...resource.requiredReservationExtraFields.map(
      field => camelCase(field)
    )];

    const { isAdmin } = this.props;

    if (termsAndConditions) {
      if (!isAdmin) requiredFormFields.push('termsAndConditions');
    }

    if (hasProducts(resource)) {
      requiredFormFields.push('paymentTermsAndConditions');
      if (!isAdmin) {
        requiredFormFields.push('billingFirstName');
        requiredFormFields.push('billingLastName');
        requiredFormFields.push('billingEmailAddress');
      }
    }

    return requiredFormFields;
  }

  render() {
    const {
      isEditing,
      isMakingReservations,
      onBack,
      onCancel,
      resource,
      selectedTime,
      t,
      unit,
      isStaff
    } = this.props;
    const {
      reservationPrice,
    } = this.state;

    const taxPercentage = get(resource, 'products[0].price.taxPercentage');

    const termsAndConditions = getTermsAndConditions(resource);
    const beginText = moment(selectedTime.begin).format('D.M.YYYY HH:mm');
    const endText = moment(selectedTime.end).format('HH:mm');
    const hours = moment(selectedTime.end).diff(selectedTime.begin, 'minutes') / 60;

    return (
      <div className="app-ReservationInformation">
        <Col md={7} sm={12}>
          <ReservationInformationForm
            fields={this.getFormFields(termsAndConditions)}
            initialValues={this.getFormInitialValues()}
            isEditing={isEditing}
            isMakingReservations={isMakingReservations}
            isStaff={isStaff}
            onBack={onBack}
            onCancel={onCancel}
            onConfirm={this.onConfirm}
            requiredFields={this.getRequiredFormFields(resource, termsAndConditions)}
            resource={resource}
            termsAndConditions={termsAndConditions}
          />
        </Col>
        <Col md={5} sm={12}>
          <div className="app-ReservationDetails">
            <h2 className="app-ReservationPage__title">{t('ReservationPage.detailsTitle')}</h2>
            <Row>
              <Col md={4}>
                <span className="app-ReservationDetails__name">
                  {t('common.resourceLabel')}
                </span>
              </Col>
              <Col md={8}>
                <span className="app-ReservationDetails__value">
                  {resource.name}
                  <br />
                  {unit.name}
                </span>
              </Col>
            </Row>
            {hasProducts(resource) && (
              <Fragment>
                <Row>
                  <Col md={4}>
                    <span className="app-ReservationDetails__name">
                      {t('common.priceLabel')}
                    </span>
                  </Col>
                  <Col md={8}>
                    <span className="app-ReservationDetails__value">
                      {getReservationPricePerPeriod(resource)}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <span className="app-ReservationDetails__name">
                      {t('common.totalPriceLabel')}
                    </span>
                  </Col>
                  <Col md={8}>
                    <span className="app-ReservationDetails__value">
                      {t('common.priceWithVAT', { price: reservationPrice, vat: taxPercentage })}
                    </span>
                  </Col>
                </Row>
              </Fragment>
            )}
            <Row>
              <Col md={4}>
                <span className="app-ReservationDetails__name">
                  {t('ReservationPage.detailsTime')}
                </span>
              </Col>
              <Col md={8}>
                <span className="app-ReservationDetails__value">
                  {`${beginText}–${endText} (${hours} h)`}
                </span>
              </Col>
            </Row>
          </div>
        </Col>
      </div>
    );
  }
}

export default injectT(ReservationInformation);
