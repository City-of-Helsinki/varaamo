import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import Checkbox from './Checkbox';
import FormControl from './FormControl';
import ReduxFormField from './ReduxFormField';

describe('shared/form-fields/ReduxFormField', () => {
  const defaultProps = {
    controlProps: { someProp: 'some', otherProp: 'other' },
    input: { name: 'email' },
    label: 'Enter your email',
    meta: { error: 'some error' },
    name: 'email',
    type: 'text',
  };

  function getWrapper(props) {
    return shallow(<ReduxFormField {...defaultProps} {...props} />);
  }

  describe('if type is "checkbox"', () => {
    it('renders a Checkbox component', () => {
      const wrapper = getWrapper({ type: 'checkbox' });
      const checkbox = wrapper.find(Checkbox);
      expect(checkbox.length).to.equal(1);
    });
  });

  describe('if type is anything else', () => {
    it('renders a FormControl component', () => {
      const wrapper = getWrapper({ type: 'text' });
      const formControl = wrapper.find(FormControl);
      expect(formControl.length).to.equal(1);
    });
  });

  describe('passing props', () => {
    it('controlProps contain both props.input and props.controlProps', () => {
      const actualProps = getWrapper().find(FormControl).props();
      const expected = Object.assign({}, defaultProps.input, defaultProps.controlProps);
      expect(actualProps.controlProps).to.deep.equal(expected);
    });

    describe('help', () => {
      const help = 'some help text';

      describe('if field contains an error', () => {
        const error = 'some error';

        describe('if field has been touched', () => {
          const touched = true;
          const meta = { error, touched };

          it('is the erorr message', () => {
            const props = { meta, help };
            const actualProps = getWrapper(props).find(FormControl).props();
            expect(actualProps.help).to.equal(error);
          });
        });

        describe('if field has not been touched', () => {
          const touched = false;
          const meta = { error, touched };

          it('is the help text given in props', () => {
            const props = { meta, help };
            const actualProps = getWrapper(props).find(FormControl).props();
            expect(actualProps.help).to.equal(help);
          });
        });
      });

      describe('if field does not contain an error', () => {
        const error = undefined;
        const meta = { error };

        it('is the help text given in props', () => {
          const props = { meta, help };
          const actualProps = getWrapper(props).find(FormControl).props();
          expect(actualProps.help).to.equal(help);
        });
      });
    });

    it('id is the name', () => {
      const actualProps = getWrapper().find(FormControl).props();
      expect(actualProps.id).to.equal(defaultProps.name);
    });

    it('label is the label given in props', () => {
      const actualProps = getWrapper().find(FormControl).props();
      expect(actualProps.label).to.equal(defaultProps.label);
    });

    it('type is the type given in props', () => {
      const actualProps = getWrapper().find(FormControl).props();
      expect(actualProps.type).to.equal(defaultProps.type);
    });

    describe('validationState', () => {
      describe('if field contains an error', () => {
        const error = 'some error';

        describe('if field has been touched', () => {
          const touched = true;
          const meta = { error, touched };

          it('is "error"', () => {
            const props = { meta };
            const actualProps = getWrapper(props).find(FormControl).props();
            expect(actualProps.validationState).to.equal('error');
          });
        });

        describe('if field has not been touched', () => {
          const touched = false;
          const meta = { error, touched };

          it('is undefined', () => {
            const props = { meta };
            const actualProps = getWrapper(props).find(FormControl).props();
            expect(actualProps.validationState).to.equal(undefined);
          });
        });
      });

      describe('if field does not contain an error', () => {
        const error = undefined;
        const meta = { error };

        it('is undefined', () => {
          const props = { meta };
          const actualProps = getWrapper(props).find(FormControl).props();
          expect(actualProps.validationState).to.equal(undefined);
        });
      });
    });
  });
});
