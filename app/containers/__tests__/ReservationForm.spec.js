import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import Button from 'react-bootstrap/lib/Button';

import {
  UnconnectedReservationForm as ReservationForm,
  validate,
} from 'containers/ReservationForm';

describe('Container: ReservationForm', () => {
  describe('validation', () => {
    describe('if field is in required fields', () => {
      const props = {
        fields: ['name'],
        requiredFields: ['name'],
      };

      it('should return an error if field value is missing', () => {
        const values = {};
        const errors = validate(values, props);
        expect(errors.name).to.exist;
      });

      it('should not return an error if field has value', () => {
        const values = { name: 'Luke' };
        const errors = validate(values, props);
        expect(errors.name).to.not.exist;
      });
    });

    describe('if field is not in required fields', () => {
      const props = {
        fields: ['name'],
        requiredFields: [],
      };

      it('should not return an error if field value is missing', () => {
        const values = {};
        const errors = validate(values, props);
        expect(errors.name).to.not.exist;
      });
    });

    describe('reserver_email_address', () => {
      const props = {
        fields: ['reserver_email_address'],
        requiredFields: [],
      };

      it('should return an error if reserver_email_address is invalid', () => {
        const values = { reserver_email_address: 'luke@' };
        const errors = validate(values, props);
        expect(errors.reserver_email_address).to.exist;
      });

      it('should not return an error if reserver_email_address is valid', () => {
        const values = { reserver_email_address: 'luke@skywalker.com' };
        const errors = validate(values, props);
        expect(errors.reserver_email_address).to.not.exist;
      });
    });
  });

  describe('rendering', () => {
    const fields = {
      name: {},
      email: {},
      phone: {},
      description: {},
      address: {},
    };
    const props = {
      fields,
      handleSubmit: simple.mock(),
      isMakingReservations: false,
      onClose: simple.mock(),
      onConfirm: simple.mock(),
      requiredFields: [],
    };
    const wrapper = shallow(<ReservationForm {...props} />);

    it('should render a form', () => {
      const form = wrapper.find('form');
      expect(form.length).to.equal(1);
    });

    describe('form buttons', () => {
      const buttons = wrapper.find(Button);

      it('should render two buttons', () => {
        expect(buttons.length).to.equal(2);
      });

      describe('Cancel button', () => {
        const button = buttons.at(0);

        it('the first button should read "Takaisin"', () => {
          expect(button.props().children).to.equal('Takaisin');
        });

        it('clicking it should call props.onClose', () => {
          props.onClose.reset();
          button.props().onClick();

          expect(props.onClose.callCount).to.equal(1);
        });
      });

      describe('Confirm button', () => {
        const button = buttons.at(1);

        it('the second button should read "Tallenna"', () => {
          expect(button.props().children).to.equal('Tallenna');
        });
      });
    });
  });
});
