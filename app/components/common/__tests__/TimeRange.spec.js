import { expect } from 'chai';
import React from 'react';
import sd from 'skin-deep';

import moment from 'moment';

import TimeRange from 'components/common/TimeRange';

describe('Component: common/TimeRange', () => {
  const props = {
    begin: '2015-10-11T12:00:00Z',
    end: '2015-10-11T14:00:00Z',
  };

  const tree = sd.shallowRender(<TimeRange {...props} />);

  it('should render a time element', () => {
    const timeTrees = tree.everySubTree('time');

    expect(timeTrees.length).to.equal(1);
  });

  it('should pass correct dateTime range to the time element', () => {
    const timeTree = tree.subTree('time');
    const expected = `${props.begin}/${props.end}`;

    expect(timeTree.props.dateTime).to.equal(expected);
  });

  describe('the humanized time range', () => {
    const humanized = tree.subTree('time').props.children;

    it('should display the begin datetime in humanized format', () => {
      const expected = moment(props.begin).format('LLLL');

      expect(humanized).to.contain(expected);
    });

    it('should display just the time from the end', () => {
      const expected = `\u2013 ${moment(props.end).format('H:mm')}`;

      expect(humanized).to.contain(expected);
    });
  });
});
