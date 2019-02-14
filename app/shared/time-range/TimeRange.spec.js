import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';

import TimeRange from './TimeRange';

describe('shared/time-range/TimeRange', () => {
  const defaultProps = {
    begin: '2015-10-11T12:00:00Z',
    className: 'some-class',
    beginFormat: 'ddd, Do MMMM',
    end: '2015-10-11T14:00:00Z',
    endFormat: 'H:mm',
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

    it('displays the begin in given beginFormat', () => {
      const expected = moment(defaultProps.begin).format(defaultProps.beginFormat);
      expect(rangeString.toLowerCase()).to.contain(expected.toLowerCase());
    });

    it('displays the end time in given endFormat', () => {
      const expected = moment(defaultProps.end).format(defaultProps.endFormat);
      expect(rangeString).to.contain(expected);
    });
  });
});
