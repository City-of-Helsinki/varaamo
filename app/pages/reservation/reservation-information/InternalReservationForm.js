/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import Form from 'react-bootstrap/lib/Form';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';

import injectT from '../../../i18n/injectT';
import FormTypes from '../../../constants/FormTypes';

export const maxLengths = {
  comments: 3
};

function mapStateToProps(state) {
  return { stateForm: state.form };
}

class UnconnectedInternalReservationForm extends Component {
  render() {
    const {
      t,
      stateForm
    } = this.props;
    const internalReservationComments = get(stateForm, 'INTERNAL_RESERVATION.values.comments');
    const internalReservationCommentsLength = internalReservationComments ? internalReservationComments.length : 0;
    return (
      <div className="app-ReservationDetails">
        <Form className="reservation-form" horizontal noValidate>
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
                    maxLength={maxLengths.comments}
                    name="comments"
                    rows={5}
                  />
                </label>
                {
                  internalReservationCommentsLength >= maxLengths.comments
                  && (
                  <span className="app-ReservationPage__error">
                    {t('ReservationForm.maxLengthError', { maxLength: maxLengths.comments })}
                  </span>
                  )
                }
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

UnconnectedInternalReservationForm.propTypes = {
  t: PropTypes.func.isRequired,
  dispatch: PropTypes.any,
  stateForm: PropTypes.any
};

export { UnconnectedInternalReservationForm };

export default injectT(reduxForm({
  form: FormTypes.INTERNAL_RESERVATION,
  initialValues: { internalReservation: true },
  maxLengths
})(connect(mapStateToProps)(UnconnectedInternalReservationForm)));
