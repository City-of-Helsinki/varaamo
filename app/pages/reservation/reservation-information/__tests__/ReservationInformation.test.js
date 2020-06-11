import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import Reservation from '../../../../utils/fixtures/Reservation';
import Resource from '../../../../utils/fixtures/Resource';
import Unit from '../../../../utils/fixtures/Unit';
import { shallowWithIntl } from '../../../../utils/testUtils';
import ReservationInformation from '../ReservationInformation';
import ReservationInformationForm from '../ReservationInformationForm';

describe('pages/reservation/reservation-information/ReservationInformation', () => {
  const defaultProps = {
    isAdmin: false,
    isEditing: false,
    isMakingReservations: false,
    isStaff: false,
    onBack: simple.stub(),
    onCancel: simple.stub(),
    onConfirm: simple.stub(),
    openResourceTermsModal: simple.stub(),
    reservation: Immutable(Reservation.build()),
    resource: Immutable(Resource.build()),
    selectedTime: {
      begin: '2016-10-10T10:00:00+03:00',
      end: '2016-10-10T11:00:00+03:00',
    },
    unit: Immutable(Unit.build()),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(
      <ReservationInformation {...defaultProps} {...extraProps} />
    );
  }

  test('renders an ReservationInformationForm element', () => {
    const form = getWrapper().find(ReservationInformationForm);
    expect(form).toHaveLength(1);
    expect(form.prop('isEditing')).toBe(defaultProps.isEditing);
    expect(form.prop('isMakingReservations')).toBe(
      defaultProps.isMakingReservations
    );
    expect(form.prop('onBack')).toBe(defaultProps.onBack);
    expect(form.prop('onCancel')).toBe(defaultProps.onCancel);
    expect(form.prop('resource')).toBe(defaultProps.resource);
  });

  test('renders correct reservation details and time', () => {
    const details = getWrapper().find('.app-ReservationDetails__value');
    expect(details).toHaveLength(2);
    expect(details.at(0).props().children).toContain(
      defaultProps.resource.name
    );
    expect(details.at(0).props().children).toContain(defaultProps.unit.name);
    expect(details.at(1).props().children).toContain('10.10.2016');
    expect(details.at(1).props().children).toContain('(1 h)');
  });

  describe('onConfirm', () => {
    test('calls prop onConfirm with correct values', () => {
      const value = 'some value';
      const onConfirm = simple.mock();
      const wrapper = getWrapper({ onConfirm });
      const instance = wrapper.instance();
      instance.onConfirm(value);

      expect(onConfirm.callCount).toBe(1);
      expect(onConfirm.lastCall.args).toEqual([value]);
    });
  });

  describe('getFormFields', () => {
    const resource = Resource.build({
      needManualConfirmation: true,
      supportedReservationExtraFields: ['some_field_1', 'some_field_2'],
    });
    const supportedFields = ['someField1', 'someField2'];

    test('returns supportedReservationExtraFields', () => {
      const wrapper = getWrapper({ resource });
      const instance = wrapper.instance();
      const actual = instance.getFormFields();

      expect(actual).toEqual(supportedFields);
    });

    test('returns supportedReservationExtraFields and admin fields when is admin', () => {
      const wrapper = getWrapper({ isAdmin: true, resource });
      const instance = wrapper.instance();
      const actual = instance.getFormFields();
      // const adminFields = ['comments',
      // 'reserverName', 'reserverEmailAddress', 'reserverPhoneNumber'];
      const adminFields = ['comments'];

      expect(actual).toEqual([...supportedFields, ...adminFields]);
    });

    test('returns supportedReservationExtraFields and staffEvent when needManualConfirmation and is staff', () => {
      const wrapper = getWrapper({ isStaff: true, resource });
      const instance = wrapper.instance();
      const actual = instance.getFormFields();

      expect(actual).toEqual([...supportedFields, 'staffEvent']);
    });

    test('returns supportedReservationExtraFields and termsAndConditions', () => {
      const termsAndConditions = 'some terms and conditions';
      const wrapper = getWrapper({ resource });
      const instance = wrapper.instance();
      const actual = instance.getFormFields(termsAndConditions);

      expect(actual).toEqual([...supportedFields, 'termsAndConditions']);
    });
  });

  describe('getFormInitialValues', () => {
    const reservation = Reservation.build({
      someField1: 'some value 1',
      someField2: 'some value 2',
    });
    const resource = Resource.build({
      requiredReservationExtraFields: ['some_field_1'],
      supportedReservationExtraFields: ['some_field_1', 'some_field_2'],
    });

    test('returns correct form values', () => {
      const expected = {
        someField1: 'some value 1',
        someField2: 'some value 2',
      };
      const wrapper = getWrapper({ reservation, resource });
      const instance = wrapper.instance();
      const actual = instance.getFormInitialValues();

      expect(actual).toEqual(expected);
    });

    test('returns staffEvent false when is editing', () => {
      const expected = {
        someField1: 'some value 1',
        someField2: 'some value 2',
        staffEvent: false,
      };
      const wrapper = getWrapper({ isEditing: true, reservation, resource });
      const instance = wrapper.instance();
      const actual = instance.getFormInitialValues();

      expect(actual).toEqual(expected);
    });

    test(// eslint-disable-next-line max-len
    'returns staffEvent true when is editing and reservation supportedReservationExtraFields are empty but not requiredReservationExtraFields', () => {
      const reservation2 = Reservation.build();
      const expected = { staffEvent: true };
      const wrapper = getWrapper({
        isEditing: true,
        reservation: reservation2,
        resource,
      });
      const instance = wrapper.instance();
      const actual = instance.getFormInitialValues();

      expect(actual).toEqual(expected);
    });
  });

  describe('getRequiredFormFields', () => {
    test('returns correct required form fields', () => {
      const resource = Resource.build({
        requiredReservationExtraFields: ['some_field_1', 'some_field_2'],
      });
      const actual = getWrapper().instance().getRequiredFormFields(resource);

      expect(actual).toEqual(['someField1', 'someField2']);
    });

    test('returns required form fields and termsAndConditions', () => {
      const resource = Resource.build({
        requiredReservationExtraFields: ['some_field_1', 'some_field_2'],
      });
      const instance = getWrapper().instance();
      const actual = instance.getRequiredFormFields(
        resource,
        'terms and conditions'
      );

      expect(actual).toEqual([
        'someField1',
        'someField2',
        'termsAndConditions',
      ]);
    });
  });
});
