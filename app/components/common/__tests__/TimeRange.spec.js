import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import moment from 'moment';

import TimeRange from 'components/common/TimeRange';

describe('Component: common/TimeRange', () => {
  const props = {
    begin: '2015-10-11T12:00:00Z',
    className: 'some-class',
    dateFormat: 'ddd, Do MMMM[ta]',
    end: '2015-10-11T14:00:00Z',
    timeFormat: 'H:mm',
  };

  const tree = sd.shallowRender(<TimeRange {...props} />);

  it('should render a time element', () => {
    const timeTrees = tree.everySubTree('time');

    expect(timeTrees.length).to.equal(1);
  });

  it('should add the given className to the time element', () => {
    expect(tree.props.className).to.equal(props.className);
  });

  it('should pass correct dateTime range to the time element', () => {
    const timeTree = tree.subTree('time');
    const expected = `${props.begin}/${props.end}`;

    expect(timeTree.props.dateTime).to.equal(expected);
  });

  describe('the datetime range string', () => {
    const rangeString = tree.subTree('time').props.children;

    it('should display the date in given dateFormat', () => {
      const expected = moment(props.begin).format(props.dateFormat);

      expect(rangeString.toLowerCase()).to.contain(expected.toLowerCase());
    });

    it('should display the begin time in given timeFormat', () => {
      const expected = moment(props.begin).format(props.timeFormat);

      expect(rangeString).to.contain(expected);
    });

    it('should display the end time in given time format', () => {
      const expected = moment(props.end).format(props.timeFormat);

      expect(rangeString).to.contain(expected);
    });
  });
});
