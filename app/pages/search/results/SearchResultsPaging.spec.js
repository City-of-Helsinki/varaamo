import { expect } from 'chai';
import React from 'react';
import { browserHistory } from 'react-router';
import Button from 'react-bootstrap/lib/Button';
import simple from 'simple-mock';

import { shallowWithIntl } from 'utils/testUtils';
import SearchResultsPaging from './SearchResultsPaging';

const defaults = {
  filters: {
    date: '2018-06-01',
    page: 1,
  },
  resultCount: 55,
};
function getWrapper(props) {
  return shallowWithIntl(<SearchResultsPaging {...defaults} {...props} />);
}

describe('pages/search/results/SearchResultsPaging', () => {
  it('renders app-SearchResultsPaging if resultCount > 0', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-SearchResultsPaging')).to.be.true;
  });

  it('renders null if resultCount is 0', () => {
    const wrapper = getWrapper({ resultCount: 0 });
    expect(wrapper.is('div')).to.be.true;
    expect(wrapper.is('div.app-SearchResultsPaging')).to.be.false;
  });

  it('renders prev and next buttons and correct number of page buttons', () => {
    const buttons = getWrapper().find(Button);
    expect(buttons).to.have.length(4);
  });

  it('prev button is disabled when current page is 1', () => {
    const filters = { page: 1 };
    const buttons = getWrapper({ filters }).find(Button);
    expect(buttons).to.have.length(4);
    expect(buttons.at(0).prop('disabled')).to.be.true;
    expect(buttons.at(3).prop('disabled')).to.be.false;
  });

  it('next button is disabled when on last page', () => {
    const filters = { page: 2 };
    const buttons = getWrapper({ filters }).find(Button);
    expect(buttons).to.have.length(4);
    expect(buttons.at(0).prop('disabled')).to.be.false;
    expect(buttons.at(3).prop('disabled')).to.be.true;
  });

  it('sets correct page button as selected', () => {
    const buttons = getWrapper().find(Button);
    const expected = 'app-SearchResultsPaging__page app-SearchResultsPaging__selected';
    expect(buttons).to.have.length(4);
    expect(buttons.at(1).prop('className')).to.equal(expected);
  });

  describe('handleClick', () => {
    const page = 3;
    const expectedPath = `/search?date=${defaults.filters.date}&page=${page}`;
    let browserHistoryMock;

    before(() => {
      const instance = getWrapper().instance();
      browserHistoryMock = simple.mock(browserHistory, 'push');
      instance.handleClick(page);
    });

    after(() => {
      simple.restore();
    });

    it('calls browserHistory push with correct path', () => {
      expect(browserHistoryMock.callCount).to.equal(1);
      expect(browserHistoryMock.lastCall.args).to.deep.equal([expectedPath]);
    });
  });

  describe('button onClick', () => {
    let instance;
    let buttons;

    before(() => {
      const filters = { page: 3 };
      const wrapper = getWrapper({ filters });
      instance = wrapper.instance();
      buttons = wrapper.find(Button);
      instance.handleClick = simple.mock();
    });

    afterEach(() => {
      instance.handleClick.reset();
    });

    after(() => {
      simple.restore();
    });

    it('page button onClick calls handleClick', () => {
      expect(buttons).to.have.length(4);
      buttons.at(2).prop('onClick')();
      expect(instance.handleClick.callCount).to.equal(1);
      expect(instance.handleClick.lastCall.args).to.deep.equal([2]);
    });

    it('prev button onClick calls handleClick', () => {
      expect(buttons).to.have.length(4);
      buttons.at(0).prop('onClick')();
      expect(instance.handleClick.callCount).to.equal(1);
      expect(instance.handleClick.lastCall.args).to.deep.equal([2]);
    });

    it('next button onClick calls handleClick', () => {
      expect(buttons).to.have.length(4);
      buttons.at(3).prop('onClick')();
      expect(instance.handleClick.callCount).to.equal(1);
      expect(instance.handleClick.lastCall.args).to.deep.equal([4]);
    });
  });
});
