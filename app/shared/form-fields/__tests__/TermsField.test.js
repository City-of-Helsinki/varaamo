import { shallow } from 'enzyme';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import RBCheckbox from 'react-bootstrap/lib/Checkbox';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';

import TermsField from '../TermsField';

describe('shared/form-fields/TermsField', () => {
  const defaultProps = {
    input: {
      name: 'terms',
    },
    label: 'some label',
    labelLink: 'some link label',
    meta: {},
    onClick: () => null,
  };

  function getWrapper(props) {
    return shallow(<TermsField {...defaultProps} {...props} />);
  }

  describe('FormGroup component', () => {
    test('is rendered', () => {
      const formGroup = getWrapper().find(FormGroup);
      expect(formGroup.length).toBe(1);
    });

    test('gets correct props', () => {
      const actualProps = getWrapper().find(FormGroup).props();
      expect(actualProps.controlId).toBe(defaultProps.input.name);
    });

    test('gets correct props if error', () => {
      const meta = { error: 'some error', touched: true };
      const actualProps = getWrapper({ meta }).find(FormGroup).props();
      expect(actualProps.validationState).toBe('error');
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
    });
  });

  describe('React Bootstrap Checkbox component', () => {
    test('is rendered', () => {
      const rbCheckbox = getWrapper().find(RBCheckbox);
      expect(rbCheckbox.length).toBe(1);
    });

    test('gets the label as its children', () => {
      const rbCheckbox = getWrapper().find(RBCheckbox);
      expect(rbCheckbox.props().children).toEqual(expect.arrayContaining([defaultProps.label]));
    });
  });

  describe('HelpBlock component', () => {
    describe('if error', () => {
      const meta = { error: 'some error', touched: true };
      test('is rendered', () => {
        const helpBlock = getWrapper({ meta }).find(HelpBlock);
        expect(helpBlock.length).toBe(1);
      });

      test('displays the error text given in props', () => {
        const helpBlock = getWrapper({ meta }).find(HelpBlock);
        expect(helpBlock.at(0).props().children).toBe(meta.error);
      });
    });

    describe('if error is not given in props', () => {
      const meta = {};
      test('is not rendered', () => {
        const helpBlock = getWrapper({ meta }).find(HelpBlock);
        expect(helpBlock.length).toBe(0);
      });
    });
  });
});
