import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Form from 'react-bootstrap/lib/Form';
import simple from 'simple-mock';

import Button from 'react-bootstrap/lib/Button';

import constants from 'constants/AppConstants';
import ReduxFormField from 'screens/shared/form-fields/ReduxFormField';
import { UnconnectedReservationForm as ReservationForm, validate } from './ReservationForm';

describe('screens/resource/reservation-confirmation/ReservationForm', () => {
  describe('validation', () => {
    describe('if field value is missing', () => {
      describe('if user is reserving an staff event', () => {
        const values = { staffEvent: true };

        describe('if field belongs to REQUIRED_STAFF_EVENT_FIELDS', () => {
          const fieldName = constants.REQUIRED_STAFF_EVENT_FIELDS[0];

          it('should return an error', () => {
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

          it('should not return an error', () => {
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

        it('should return an error if field is in requiredFields', () => {
          const fieldName = 'someField';
          const props = {
            fields: [fieldName],
            requiredFields: [fieldName],
          };
          const errors = validate(values, props);
          expect(errors[fieldName]).to.exist;
        });

        it('should not return an error if field is not in requiredFields', () => {
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
      it('should not return an error even if field is required', () => {
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

      it('should return an error if reserverEmailAddress is invalid', () => {
        const values = { reserverEmailAddress: 'luke@' };
        const errors = validate(values, props);
        expect(errors.reserverEmailAddress).to.exist;
      });

      it('should not return an error if reserverEmailAddress is valid', () => {
        const values = { reserverEmailAddress: 'luke@skywalker.com' };
        const errors = validate(values, props);
        expect(errors.reserverEmailAddress).to.not.exist;
      });
    });
  });

  describe('rendering', () => {
    const defaultProps = {
      fields: {},
      handleSubmit: simple.mock(),
      isMakingReservations: false,
      onClose: simple.mock(),
      onConfirm: simple.mock(),
      requiredFields: [],
    };

    function getWrapper(extraProps) {
      return shallow(<ReservationForm {...defaultProps} {...extraProps} />);
    }

    it('should render a Form component', () => {
      const form = getWrapper().find(Form);
      expect(form.length).to.equal(1);
    });

    describe('form fields', () => {
      describe('fields included in RESERVATION_FORM_FIELDS', () => {
        it('should render a field if it is included in props.fields', () => {
          const fields = {
            [constants.RESERVATION_FORM_FIELDS[0]]: {},
          };
          const input = getWrapper({ fields }).find(ReduxFormField);
          expect(input.length).to.equal(1);
        });

        it('should not render a field if it is not included in props.fields', () => {
          const fields = {};
          const input = getWrapper({ fields }).find(ReduxFormField);
          expect(input.length).to.equal(0);
        });

        describe('required fields', () => {
          it('should display an asterisk beside a required field label', () => {
            const fieldName = constants.RESERVATION_FORM_FIELDS[0];
            const props = {
              fields: { [fieldName]: { name: fieldName } },
              requiredFields: [fieldName],
            };
            const input = getWrapper(props).find(ReduxFormField);
            expect(input.props().label).to.contain('*');
          });

          it('should not display an asterisk beside a non required field label', () => {
            const fieldName = constants.RESERVATION_FORM_FIELDS[0];
            const props = {
              fields: { [fieldName]: { name: fieldName } },
              requiredFields: [],
            };
            const input = getWrapper(props).find(ReduxFormField);
            expect(input.props().label).to.not.contain('*');
          });

          describe('if staffEvent checkbox is checked', () => {
            const defaultFields = { staffEvent: { name: 'staffEvent', checked: true } };

            it('should show an asterisk beside REQUIRED_STAFF_EVENT_FIELDS', () => {
              const fieldName = constants.REQUIRED_STAFF_EVENT_FIELDS[0];
              const fields = Object.assign({}, defaultFields, { [fieldName]: { name: fieldName } });
              const props = {
                fields,
                requiredFields: [fieldName],
              };
              const input = getWrapper(props).find(ReduxFormField).at(1);
              expect(input.props().label).to.contain('*');
            });

            it('should not show an asterisk beside non REQUIRED_STAFF_EVENT_FIELDS', () => {
              const fieldName = constants.RESERVATION_FORM_FIELDS[1];
              const fields = Object.assign({}, defaultFields, { [fieldName]: { name: fieldName } });
              const props = {
                fields,
                requiredFields: [fieldName],
              };
              const input = getWrapper(props).find(ReduxFormField).at(1);
              expect(input.props().label).to.not.contain('*');
            });
          });
        });
      });

      describe('fields not included in RESERVATION_FORM_FIELDS', () => {
        it('should not render a field even if it is included in props.fields', () => {
          const fields = {
            someOtherField: {},
          };
          const input = getWrapper({ fields }).find(ReduxFormField);
          expect(input.length).to.equal(0);
        });
      });
    });

    describe('form buttons', () => {
      const buttons = getWrapper().find(Button);

      it('should render two buttons', () => {
        expect(buttons.length).to.equal(2);
      });

      describe('Cancel button', () => {
        const button = buttons.at(0);

        it('the first button should read "Takaisin"', () => {
          expect(button.props().children).to.equal('Takaisin');
        });

        it('clicking it should call props.onClose', () => {
          defaultProps.onClose.reset();
          button.props().onClick();

          expect(defaultProps.onClose.callCount).to.equal(1);
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
