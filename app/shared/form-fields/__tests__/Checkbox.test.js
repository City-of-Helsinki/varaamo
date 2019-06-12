import { shallow } from 'enzyme';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import RBCheckbox from 'react-bootstrap/lib/Checkbox';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

import Checkbox from '../Checkbox';

describe('shared/form-fields/Checkbox', () => {
  const defaultProps = {
    controlProps: { someProp: 'some', otherProp: 'other' },
    id: 'email',
    label: 'Enter your email',
    validationState: 'error',
  };

  function getWrapper(props) {
    return shallow(<Checkbox {...defaultProps} {...props} />);
  }

  describe('FormGroup component', () => {
    test('is rendered', () => {
      const formGroup = getWrapper().find(FormGroup);
      expect(formGroup.length).toBe(1);
    });

    test('gets correct props', () => {
      const actualProps = getWrapper().find(FormGroup).props();
      expect(actualProps.controlId).toBe(defaultProps.id);
      expect(actualProps.validationState).toBe(defaultProps.validationState);
    });
  });

  describe('Col component', () => {
    test('is rendered', () => {
      const col = getWrapper().find(Col);
      expect(col.length).toBe(1);
    });

    test('gets correct props', () => {
      const actualProps = getWrapper().find(Col).props();
      expect(actualProps.sm).toBe(9);
      expect(actualProps.smOffset).toBe(3);
    });
  });

  describe('React Bootstrap Checkbox component', () => {
    test('is rendered', () => {
      const rbCheckbox = getWrapper().find(RBCheckbox);
      expect(rbCheckbox.length).toBe(1);
    });

    test('gets correct props', () => {
      const actualProps = getWrapper().find(RBCheckbox).props();
      Object.keys(defaultProps.controlProps).forEach((key) => {
        expect(actualProps[key]).toBe(defaultProps.controlProps[key]);
      });
    });

    test('gets the label as its children', () => {
      const rbCheckbox = getWrapper().find(RBCheckbox);
      expect(rbCheckbox.props().children).toBe(defaultProps.label);
    });
  });

  describe('HelpBlock component', () => {
    describe('if help is given in props', () => {
      const help = 'some help';

      test('is rendered', () => {
        const helpBlock = getWrapper({ help }).find(HelpBlock);
        expect(helpBlock.length).toBe(1);
      });

      test('displays the help text given in props', () => {
        const helpBlock = getWrapper({ help }).find(HelpBlock);
        expect(helpBlock.props().children).toBe(help);
      });
    });

    describe('if help is not given in props', () => {
      const help = undefined;

      test('is not rendered', () => {
        const helpBlock = getWrapper({ help }).find(HelpBlock);
        expect(helpBlock.length).toBe(0);
      });
    });
  });
});
