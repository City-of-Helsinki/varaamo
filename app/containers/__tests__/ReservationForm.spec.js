import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';

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

    describe('email', () => {
      const props = {
        fields: ['email'],
        requiredFields: [],
      };

      it('should return an error if email is invalid', () => {
        const values = { email: 'luke@' };
        const errors = validate(values, props);
        expect(errors.email).to.exist;
      });

      it('should not return an error if email is valid', () => {
        const values = { email: 'luke@skywalker.com' };
        const errors = validate(values, props);
        expect(errors.email).to.not.exist;
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

    describe('form inputs', () => {
      const inputs = wrapper.find(Input);

      it('should render 5 inputs', () => {
        expect(inputs.length).to.equal(5);
      });

      it('should render a text input with label "Nimi*"', () => {
        const nameInput = inputs.at(0);

        expect(nameInput.props().type).to.equal('text');
        expect(nameInput.props().label).to.equal('Nimi*');
      });

      it('should render a email input with label "Sähköposti*"', () => {
        const nameInput = inputs.at(1);

        expect(nameInput.props().type).to.equal('email');
        expect(nameInput.props().label).to.equal('Sähköposti*');
      });

      it('should render a text input with label "Puhelin*"', () => {
        const nameInput = inputs.at(2);

        expect(nameInput.props().type).to.equal('text');
        expect(nameInput.props().label).to.equal('Puhelin*');
      });

      it('should render a textarea input with label "Tilaisuuden kuvaus*"', () => {
        const nameInput = inputs.at(3);

        expect(nameInput.props().type).to.equal('textarea');
        expect(nameInput.props().label).to.equal('Tilaisuuden kuvaus*');
      });

      it('should render a text input with label "Osoite*"', () => {
        const nameInput = inputs.at(4);

        expect(nameInput.props().type).to.equal('text');
        expect(nameInput.props().label).to.equal('Osoite*');
      });
    });

    describe('form buttons', () => {
      const buttons = wrapper.find(Button);

      it('should render two buttons', () => {
        expect(buttons.length).to.equal(2);
      });

      describe('Cancel button', () => {
        const button = buttons.at(0);

        it('the first button should read "Peruuta"', () => {
          expect(button.props().children).to.equal('Peruuta');
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
