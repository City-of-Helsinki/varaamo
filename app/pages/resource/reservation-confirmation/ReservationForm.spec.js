import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import { Field } from 'redux-form';
import simple from 'simple-mock';

import WrappedText from 'shared/wrapped-text';
import constants from 'constants/AppConstants';
import { UnconnectedReservationForm as ReservationForm, validate } from './ReservationForm';

describe('pages/resource/reservation-confirmation/ReservationForm', () => {
  describe('validation', () => {
    describe('if field value is missing', () => {
      describe('if user is reserving an staff event', () => {
        const values = { staffEvent: true };

        describe('if field belongs to REQUIRED_STAFF_EVENT_FIELDS', () => {
          const fieldName = constants.REQUIRED_STAFF_EVENT_FIELDS[0];

          it('returns an error', () => {
            const props = {
              fields: [fieldName],
              requiredFields: [],
            };
            const errors = validate(values, props);
            expect(errors[fieldName]).to.exist;
          });
        });

        describe('if field does not belong to REQUIRED_STAFF_EVENT_FIELDS', () => {
          const fieldName = 'someField';

          it('does not return an error', () => {
            const props = {
              fields: [fieldName],
              requiredFields: [],
            };
            const errors = validate(values, props);
            expect(errors[fieldName]).to.not.exist;
          });
        });
      });

      describe('if user is reserving a regular event', () => {
        const values = {};

        it('returns an error if field is in requiredFields', () => {
          const fieldName = 'someField';
          const props = {
            fields: [fieldName],
            requiredFields: [fieldName],
          };
          const errors = validate(values, props);
          expect(errors[fieldName]).to.exist;
        });

        it('does not return an error if field is not in requiredFields', () => {
          const fieldName = 'someField';
          const props = {
            fields: [fieldName],
            requiredFields: [],
          };
          const errors = validate(values, props);
          expect(errors[fieldName]).to.not.exist;
        });
      });
    });

    describe('if field has a value', () => {
      it('does not return an error even if field is required', () => {
        const props = { fields: ['name'], requiredFields: ['name'] };
        const values = { name: 'Luke' };
        const errors = validate(values, props);
        expect(errors.name).to.not.exist;
      });
    });

    describe('reserverEmailAddress', () => {
      const props = {
        fields: ['reserverEmailAddress'],
        requiredFields: [],
      };

      it('returns an error if reserverEmailAddress is invalid', () => {
        const values = { reserverEmailAddress: 'luke@' };
        const errors = validate(values, props);
        expect(errors.reserverEmailAddress).to.exist;
      });

      it('does not return an error if reserverEmailAddress is valid', () => {
        const values = { reserverEmailAddress: 'luke@skywalker.com' };
        const errors = validate(values, props);
        expect(errors.reserverEmailAddress).to.not.exist;
      });
    });
  });

  describe('rendering', () => {
    const defaultProps = {
      fields: [],
      handleSubmit: simple.mock(),
      isMakingReservations: false,
      onClose: simple.mock(),
      onConfirm: simple.mock(),
      requiredFields: [],
      termsAndConditions: '',
    };

    function getWrapper(extraProps) {
      return shallow(<ReservationForm {...defaultProps} {...extraProps} />);
    }

    it('renders a Form component', () => {
      const form = getWrapper().find(Form);
      expect(form.length).to.equal(1);
    });

    describe('form fields', () => {
      describe('fields included in RESERVATION_FORM_FIELDS', () => {
        it('renders a field if it is included in props.fields', () => {
          const fields = [constants.RESERVATION_FORM_FIELDS[0]];
          const input = getWrapper({ fields }).find(Field);
          expect(input.length).to.equal(1);
        });

        it('does not render a field if it is not included in props.fields', () => {
          const fields = [];
          const input = getWrapper({ fields }).find(Field);
          expect(input.length).to.equal(0);
        });

        describe('required fields', () => {
          it('displays an asterisk beside a required field label', () => {
            const fieldName = constants.RESERVATION_FORM_FIELDS[0];
            const props = {
              fields: [fieldName],
              requiredFields: [fieldName],
            };
            const input = getWrapper(props).find(Field);
            expect(input.props().label).to.contain('*');
          });

          it('does not display an asterisk beside a non required field label', () => {
            const fieldName = constants.RESERVATION_FORM_FIELDS[0];
            const props = {
              fields: [fieldName],
              requiredFields: [],
            };
            const input = getWrapper(props).find(Field);
            expect(input.props().label).to.not.contain('*');
          });

          describe('if staffEvent checkbox is checked', () => {
            const staffEventSelected = true;

            it('shows an asterisk beside REQUIRED_STAFF_EVENT_FIELDS', () => {
              const fieldName = constants.REQUIRED_STAFF_EVENT_FIELDS[0];
              const fields = [fieldName];
              const props = {
                fields,
                requiredFields: [fieldName],
                staffEventSelected,
              };
              const input = getWrapper(props).find(Field);
              expect(input.props().label).to.contain('*');
            });

            it('does not show an asterisk beside non REQUIRED_STAFF_EVENT_FIELDS', () => {
              const fieldName = constants.RESERVATION_FORM_FIELDS[1];
              const fields = [fieldName];
              const props = {
                fields,
                requiredFields: [fieldName],
                staffEventSelected,
              };
              const input = getWrapper(props).find(Field);
              expect(input.props().label).to.not.contain('*');
            });
          });
        });
      });

      describe('fields not included in RESERVATION_FORM_FIELDS', () => {
        it('does not render a field even if it is included in props.fields', () => {
          const fields = ['someOtherField'];
          const input = getWrapper({ fields }).find(Field);
          expect(input.length).to.equal(0);
        });
      });
    });

    describe('terms and conditions', () => {
      describe('when terms and conditions are given in props', () => {
        const termsAndConditions = 'Some terms and conditions text';
        const wrapper = getWrapper({ termsAndConditions });
        const termsAndConditionsDiv = wrapper.find('.terms-and-conditions');

        it('renders a div for terms and conditions', () => {
          expect(termsAndConditionsDiv.length).to.equal(1);
        });

        it('renders a header for terms and conditions', () => {
          const header = termsAndConditionsDiv.find('h5');

          expect(header.length).to.equal(1);
          expect(header.text()).to.equal('Tilan käyttösäännöt');
        });

        it('renders the terms and conditions text inside WrappedText component', () => {
          const wrappedText = termsAndConditionsDiv.find(WrappedText);

          expect(wrappedText.length).to.equal(1);
          expect(wrappedText.prop('text')).to.equal(termsAndConditions);
        });

        it('renders terms and conditions input wrapper', () => {
          const inputWrapper = wrapper.find('.terms-and-conditions-input-wrapper');

          expect(inputWrapper.length).to.equal(1);
        });
      });

      describe('when terms and conditions are not given in props', () => {
        const termsAndConditions = '';
        const wrapper = getWrapper({ termsAndConditions });

        it('does not render a div for terms and conditions', () => {
          const termsAndConditionsDiv = wrapper.find('.terms-and-conditions');

          expect(termsAndConditionsDiv.length).to.equal(0);
        });

        it('does not render terms and conditions input wrapper', () => {
          const inputWrapper = wrapper.find('.terms-and-conditions-input-wrapper');

          expect(inputWrapper.length).to.equal(0);
        });
      });
    });

    describe('form buttons', () => {
      const buttons = getWrapper().find(Button);

      it('renders two buttons', () => {
        expect(buttons.length).to.equal(2);
      });

      describe('the first button', () => {
        const button = buttons.at(0);

        it('has text "Takaisin"', () => {
          expect(button.props().children).to.equal('Takaisin');
        });

        it('clicking it calls props.onClose', () => {
          defaultProps.onClose.reset();
          button.props().onClick();

          expect(defaultProps.onClose.callCount).to.equal(1);
        });
      });

      describe('the second button', () => {
        const button = buttons.at(1);

        it('has text "Tallenna"', () => {
          expect(button.props().children).to.equal('Tallenna');
        });
      });
    });
  });
});
