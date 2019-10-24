/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import Form from 'react-bootstrap/lib/Form';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import injectT from '../../../i18n/injectT';
import FormTypes from '../../../constants/FormTypes';

export function validate() {
  const errors = {};
  return errors;
}

class UnconnectedInternalReservationForm extends Component {
  state = {
    internalReservationDefaultChecked: true
  }

  render() {
    /**
     * TODO Add FI/SV/EN translations!
     */
    const premiseStaffOnly = 'Premise staff only';
    const internalReservation = 'Internal reservation';
    const internalReservationDescription = 'The Department\'s own event. Uncheck this box to make an external reservation on behalf of the user.';
    const markAsClosed = 'Mark as closed';
    const markAsClosedDescription = 'Check if you are closing the resource by reserving.';
    const comment = 'Comment';
    return (
      <div className="app-ReservationDetails">
        <Form className="reservation-form" horizontal noValidate>
          <h2 className="app-ReservationPage__title">{premiseStaffOnly}</h2>
          <Row>
            <Col md={1}>
              <Field
                checked={this.state.internalReservationDefaultChecked}
                component="input"
                name="internalReservation"
                onChange={() => this.setState(prevState => ({ internalReservationDefaultChecked: !prevState.internalReservationDefaultChecked }))}
                type="checkbox"
              />
            </Col>
            <Col md={11}>
              <span className="app-ReservationDetails__value">
                {internalReservation}
                <br />
                {internalReservationDescription}
              </span>
            </Col>
          </Row>
          <Row>
            <Col md={1}>
              <Field
                component="input"
                name="markAsClosed"
                type="checkbox"
              />
            </Col>
            <Col md={11}>
              <span className="app-ReservationDetails__value">
                {markAsClosed}
                <br />
                {markAsClosedDescription}
              </span>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <div className="app-ReservationPage__formfield">
                <label>
                  {comment}
                  <Field
                    component="textarea"
                    name="internalReservationComments"
                    rows={5}
                  />
                </label>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

UnconnectedInternalReservationForm.propTypes = {};
UnconnectedInternalReservationForm = injectT(UnconnectedInternalReservationForm);  // eslint-disable-line

export { UnconnectedInternalReservationForm };
export default injectT(reduxForm({
  form: FormTypes.RESERVATION,
  validate
})(UnconnectedInternalReservationForm));
