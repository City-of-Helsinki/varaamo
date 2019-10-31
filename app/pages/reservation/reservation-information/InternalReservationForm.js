/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import PropTypes from 'prop-types';

import injectT from '../../../i18n/injectT';
import FormTypes from '../../../constants/FormTypes';

class UnconnectedInternalReservationForm extends Component {
  render() {
    const {
      t,
      commentsMaxLengths,
      valid
    } = this.props;
    return (
      <div className="app-ReservationDetails">
        <h2 className="app-ReservationPage__title">{t('ReservationForm.premiseStaffOnly')}</h2>
        <Row>
          <Col md={1}>
            <label className="app-InternalReservationForm__checkbox">
              <Field
                component="input"
                id="internalReservationChecked"
                name="internalReservation"
                type="checkbox"
              />
              <span className="custom-checkmark" />
            </label>
          </Col>
          <Col md={11}>
            <span className="app-ReservationDetails__value">
              {t('ReservationForm.internalReservation')}
              <br />
              {t('ReservationForm.internalReservationDescription')}
            </span>
          </Col>
        </Row>
        <Row>
          <Col md={1}>
            <label className="app-InternalReservationForm__checkbox">
              <Field
                component="input"
                name="markAsClosed"
                type="checkbox"
              />
              <span className="custom-checkmark" />
            </label>
          </Col>
          <Col md={11}>
            <span className="app-ReservationDetails__value">
              {t('ReservationForm.markAsClosed')}
              <br />
              {t('ReservationForm.markAsClosedDescription')}
            </span>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="app-ReservationPage__formfield">
              <label>
                {t('common.comments')}
                <Field
                  component="textarea"
                  maxLength={commentsMaxLengths}
                  name="comments"
                  rows={5}
                />
              </label>
              {
                !valid
                && (
                <span className="app-ReservationPage__error">
                  {t('ReservationForm.maxLengthError', { maxLength: commentsMaxLengths })}
                </span>
                )
              }
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

UnconnectedInternalReservationForm.propTypes = {
  t: PropTypes.func.isRequired,
  commentsMaxLengths: PropTypes.number.isRequired,
  valid: PropTypes.bool.isRequired
};

export default injectT(reduxForm({
  form: FormTypes.RESERVATION,
  initialValues: { internalReservation: true }
})(UnconnectedInternalReservationForm));
