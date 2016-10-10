import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';

import TimeRange from './TimeRange';

describe('shared/time-range/TimeRange', () => {
  const defaultProps = {
    begin: '2015-10-11T12:00:00Z',
    className: 'some-class',
    dateFormat: 'ddd, Do MMMM[ta]',
    end: '2015-10-11T14:00:00Z',
    timeFormat: 'H:mm',
  };

  function getWrapper(extraProps) {
    return shallow(<TimeRange {...defaultProps} {...extraProps} />);
  }

  it('renders a time element', () => {
    const time = getWrapper().find('time');

    expect(time.length).to.equal(1);
  });

  it('adds the given className to the time element', () => {
    const time = getWrapper().find('time');

    expect(time.props().className).to.equal(defaultProps.className);
  });

  it('passes correct dateTime range to the time element', () => {
    const time = getWrapper().find('time');
    const expected = `${defaultProps.begin}/${defaultProps.end}`;

    expect(time.props().dateTime).to.equal(expected);
  });

  describe('the datetime range string', () => {
    const rangeString = getWrapper().find('time').props().children;

    it('displays the date in given dateFormat', () => {
      const expected = moment(defaultProps.begin).format(defaultProps.dateFormat);

      expect(rangeString.toLowerCase()).to.contain(expected.toLowerCase());
    });

    it('displays the begin time in given timeFormat', () => {
      const expected = moment(defaultProps.begin).format(defaultProps.timeFormat);

      expect(rangeString).to.contain(expected);
    });

    it('displays the end time in given time format', () => {
      const expected = moment(defaultProps.end).format(defaultProps.timeFormat);

      expect(rangeString).to.contain(expected);
    });
  });
});
