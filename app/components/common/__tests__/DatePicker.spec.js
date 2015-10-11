import { expect } from 'chai';
import React from 'react';
import simple from 'simple-mock';
import sd from 'skin-deep';

import DatePicker from 'components/common/DatePicker';
import { DATE_FORMAT } from 'constants/AppConstants';

describe('Component: DatePicker', () => {
  const props = {
    date: '2015-10-11',
    onChange: simple.stub(),
  };

  const tree = sd.shallowRender(<DatePicker {...props} />);

  describe('DateTimeField', () => {
    const dateTimeFieldTrees = tree.everySubTree('DateTimeField');
    const dateTimeFieldVdom = dateTimeFieldTrees[0].getRenderOutput();

    it('should render a DateTimeField component', () => {
      expect(dateTimeFieldTrees.length).to.equal(1);
    });

    it('should be in "date" mode', () => {
      expect(dateTimeFieldVdom.props.mode).to.equal('date');
    });

    it('should pass correct props to DateTimeField component', () => {
      const actualProps = dateTimeFieldVdom.props;

      expect(actualProps.dateTime).to.equal(props.date);
      expect(actualProps.format).to.equal(DATE_FORMAT);
      expect(actualProps.inputFormat).to.equal('DD.MM.YYYY');
      expect(actualProps.onChange).to.equal(props.onChange);
    });

    describe('onChange', () => {
      const newDate = '2015-12-24';

      before(() => {
        dateTimeFieldVdom.props.onChange(newDate);
      });

      it('should call the passed onChange function', () => {
        expect(props.onChange.callCount).to.equal(1);
      });

      it('should call the passed onChange function with correct arguments', () => {
        const expected = newDate;

        expect(props.onChange.lastCall.args[0]).to.equal(expected);
      });
    });
  });
});
