import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';

import Input from 'react-bootstrap/lib/Input';

import ReduxFormField from 'components/common/ReduxFormField';

describe('Component: common/ReduxFormField', () => {
  describe('rendering', () => {
    const defaultProps = {
      extraProps: { someProp: 'some', otherProp: 'other' },
      field: { name: 'email', foo: 'bar' },
      label: 'Enter your email',
      type: 'text',
    };

    function getWrapper(props) {
      return shallow(<ReduxFormField {...defaultProps} {...props} />);
    }

    it('should render an Input component', () => {
      const input = getWrapper().find(Input);
      expect(input.length).to.equal(1);
    });

    describe('passing props', () => {
      it('should pass field properties as props', () => {
        const actualProps = getWrapper().find(Input).props();
        Object.keys(defaultProps.field).forEach(key => {
          expect(actualProps[key]).to.equal(defaultProps.field[key]);
        });
      });

      it('should pass extraProps properties as props', () => {
        const actualProps = getWrapper().find(Input).props();
        Object.keys(defaultProps.extraProps).forEach(key => {
          expect(actualProps[key]).to.equal(defaultProps.extraProps[key]);
        });
      });

      describe('bsStyle', () => {
        describe('if field contains an error', () => {
          const error = 'some error';

          describe('if field has been touched', () => {
            const touched = true;

            it('should pass "error"', () => {
              const props = { field: { error, touched } };
              const actualProps = getWrapper(props).find(Input).props();
              expect(actualProps.bsStyle).to.equal('error');
            });
          });

          describe('if field has not been touched', () => {
            const touched = false;

            it('should pass null', () => {
              const props = { field: { error, touched } };
              const actualProps = getWrapper(props).find(Input).props();
              expect(actualProps.bsStyle).to.equal(null);
            });
          });
        });

        describe('if field does not contain an error', () => {
          const error = undefined;

          it('should pass null', () => {
            const props = { field: { error } };
            const actualProps = getWrapper(props).find(Input).props();
            expect(actualProps.bsStyle).to.equal(null);
          });
        });
      });

      describe('help', () => {
        const extraProps = { help: 'some help text' };

        describe('if field contains an error', () => {
          const error = 'some error';

          describe('if field has been touched', () => {
            const touched = true;

            it('should pass the erorr message as help', () => {
              const props = { extraProps, field: { error, touched } };
              const actualProps = getWrapper(props).find(Input).props();
              expect(actualProps.help).to.equal(error);
            });
          });

          describe('if field has not been touched', () => {
            const touched = false;

            it('should pass extraProps.help as help', () => {
              const props = { extraProps, field: { error, touched } };
              const actualProps = getWrapper(props).find(Input).props();
              expect(actualProps.help).to.equal(extraProps.help);
            });
          });
        });

        describe('if field does not contain an error', () => {
          const error = undefined;

          it('should pass extraProps.help as help', () => {
            const props = { extraProps, field: { error } };
            const actualProps = getWrapper(props).find(Input).props();
            expect(actualProps.help).to.equal(extraProps.help);
          });
        });
      });

      it('should pass correct label', () => {
        const actualProps = getWrapper().find(Input).props();
        expect(actualProps.label).to.equal(defaultProps.label);
      });

      describe('labelClassName', () => {
        describe('if type is checkbox', () => {
          it('should pass correct labelClassName', () => {
            const props = { extraProps: { labelClassName: 'label-class' }, type: 'checkbox' };
            const actualProps = getWrapper(props).find(Input).props();
            const expected = ` ${props.extraProps.labelClassName}`;
            expect(actualProps.labelClassName).to.equal(expected);
          });
        });

        describe('if type is not checkbox', () => {
          it('should pass correct labelClassName', () => {
            const props = { extraProps: { labelClassName: 'label-class' }, type: 'text' };
            const actualProps = getWrapper(props).find(Input).props();
            const expected = `col-sm-3 ${props.extraProps.labelClassName}`;
            expect(actualProps.labelClassName).to.equal(expected);
          });
        });
      });

      it('should pass correct type', () => {
        const actualProps = getWrapper().find(Input).props();
        expect(actualProps.type).to.equal(defaultProps.type);
      });

      describe('wrapperClassName', () => {
        describe('if type is checkbox', () => {
          it('should pass correct wrapperClassName', () => {
            const props = { extraProps: { wrapperClassName: 'wrapper-class' }, type: 'checkbox' };
            const actualProps = getWrapper(props).find(Input).props();
            const expected = `col-md-12 checkbox-field ${props.extraProps.wrapperClassName}`;
            expect(actualProps.wrapperClassName).to.contain(expected);
          });
        });

        describe('if type is not checkbox', () => {
          it('should pass correct wrapperClassName', () => {
            const props = { extraProps: { wrapperClassName: 'wrapper-class' }, type: 'text' };
            const actualProps = getWrapper(props).find(Input).props();
            const expected = `col-sm-9 ${props.extraProps.wrapperClassName}`;
            expect(actualProps.wrapperClassName).to.equal(expected);
          });
        });
      });
    });
  });
});
