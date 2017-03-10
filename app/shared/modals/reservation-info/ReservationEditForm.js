import isEmpty from 'lodash/isEmpty';
import React, { Component, PropTypes } from 'react';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import { Field, reduxForm } from 'redux-form';

import ReduxFormField from 'shared/form-fields/ReduxFormField';
import TimeRange from 'shared/time-range';
import { injectT } from 'i18n';

class UnconnectedReservationEditForm extends Component {
  constructor(props) {
    super(props);
    this.renderAddressRow = this.renderAddressRow.bind(this);
    this.renderEditableInfoRow = this.renderEditableInfoRow.bind(this);
    this.renderInfoRow = this.renderInfoRow.bind(this);
  }

  getAddress(street, zip, city) {
    const ending = `${zip} ${city}`;
    if (street && (zip || city)) {
      return `${street}, ${ending}`;
    }
    return `${street} ${ending}`;
  }

  renderAddressRow(addressType) {
    const { reservation, t } = this.props;
    const hasAddress = (
      reservation.reserverAddressStreet || reservation.reserverAddressStreet === ''
    );
    if (!hasAddress) return null;
    const label = t(`common.${addressType}Label`);
    const value = this.getAddress(
      reservation[`${addressType}Street`],
      reservation[`${addressType}Zip`],
      reservation[`${addressType}City`]
    );
    return this.renderInfoRow(label, value);
  }

  renderInfoRow(label, value) {
    if (!value && value !== '') return null;
    return (
      <FormGroup>
        <Col sm={3}>
          <ControlLabel>{label}</ControlLabel>
        </Col>
        <Col sm={9}>
          <FormControl.Static>{value}</FormControl.Static>
        </Col>
      </FormGroup>
    );
  }

  renderEditableInfoRow(propertyName, type) {
    const { isEditing, reservation, t } = this.props;
    if (!isEditing) return this.renderStaticInfoRow(propertyName);
    const property = reservation[propertyName];
    if (!property && property !== '') return null;
    return (
      <Field
        component={ReduxFormField}
        controlProps={{}}
        label={t(`common.${propertyName}Label`)}
        name={propertyName}
        type={type}
      />
    );
  }

  renderStaticInfoRow(propertyName) {
    const { reservation, t } = this.props;
    const value = reservation[propertyName];
    const label = t(`common.${propertyName}Label`);
    return this.renderInfoRow(label, value);
  }

  render() {
    const {
      isStaff,
      reservation,
      resource,
      showComments,
      t,
    } = this.props;

    if (isEmpty(reservation)) return <span />;
    const reservationTime = <TimeRange begin={reservation.begin} end={reservation.end} />;

    return (
      <Form className="reservation-edit-form" horizontal>
        {this.renderEditableInfoRow('eventSubject', 'text')}
        {this.renderStaticInfoRow('reserverName')}
        {this.renderEditableInfoRow('eventDescription', 'textarea')}
        {this.renderEditableInfoRow('numberOfParticipants', 'number')}
        {this.renderInfoRow(t('common.reservationTimeLabel'), reservationTime)}
        {this.renderInfoRow(t('common.resourceLabel'), resource.name)}

        {isStaff && this.renderStaticInfoRow('reserverId')}
        {this.renderStaticInfoRow('reserverPhoneNumber')}
        {this.renderStaticInfoRow('reserverEmailAddress')}
        {this.renderAddressRow('reserverAddress')}
        {this.renderAddressRow('billingAddress')}
        {this.renderStaticInfoRow('accessCode')}
        {showComments && this.renderStaticInfoRow('comments')}
      </Form>
    );
  }
}

UnconnectedReservationEditForm.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  isStaff: PropTypes.bool.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  showComments: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};
UnconnectedReservationEditForm = injectT(UnconnectedReservationEditForm);  // eslint-disable-line

export { UnconnectedReservationEditForm };
export default injectT(reduxForm({
  form: 'reservationEdit',
})(UnconnectedReservationEditForm));
