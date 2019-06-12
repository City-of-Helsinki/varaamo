import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import simple from 'simple-mock';

import { shallowWithIntl } from '../../../../utils/testUtils';
import SearchResultsPaging from '../SearchResultsPaging';

const history = {
  push: () => {},
};

const defaults = {
  history,
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
  test('renders app-SearchResultsPaging if resultCount > 0', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-SearchResultsPaging')).toBe(true);
  });

  test('renders null if resultCount is 0', () => {
    const wrapper = getWrapper({ resultCount: 0 });
    expect(wrapper.is('div')).toBe(true);
    expect(wrapper.is('div.app-SearchResultsPaging')).toBe(false);
  });

  test(
    'renders prev and next buttons and correct number of page buttons',
    () => {
      const buttons = getWrapper().find(Button);
      expect(buttons).toHaveLength(4);
    }
  );

  test('prev button is disabled when current page is 1', () => {
    const filters = { page: 1 };
    const buttons = getWrapper({ filters }).find(Button);
    expect(buttons).toHaveLength(4);
    expect(buttons.at(0).prop('disabled')).toBe(true);
    expect(buttons.at(3).prop('disabled')).toBe(false);
  });

  test('next button is disabled when on last page', () => {
    const filters = { page: 2 };
    const buttons = getWrapper({ filters }).find(Button);
    expect(buttons).toHaveLength(4);
    expect(buttons.at(0).prop('disabled')).toBe(false);
    expect(buttons.at(3).prop('disabled')).toBe(true);
  });

  test('sets correct page button as selected', () => {
    const buttons = getWrapper().find(Button);
    const expected = 'app-SearchResultsPaging__page app-SearchResultsPaging__selected';
    expect(buttons).toHaveLength(4);
    expect(buttons.at(1).prop('className')).toBe(expected);
  });

  describe('handleClick', () => {
    const page = 3;
    const expectedPath = `/search?date=${defaults.filters.date}&page=${page}`;
    let historyMock;

    beforeAll(() => {
      const instance = getWrapper().instance();
      historyMock = simple.mock(history, 'push');
      instance.handleClick(page);
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls browserHistory push with correct path', () => {
      expect(historyMock.callCount).toBe(1);
      expect(historyMock.lastCall.args).toEqual([expectedPath]);
    });
  });

  describe('button onClick', () => {
    let instance;
    let buttons;

    beforeAll(() => {
      const filters = { page: 3 };
      const wrapper = getWrapper({ filters });
      instance = wrapper.instance();
      buttons = wrapper.find(Button);
      instance.handleClick = simple.mock();
    });

    afterEach(() => {
      instance.handleClick.reset();
    });

    afterAll(() => {
      simple.restore();
    });

    test('page button onClick calls handleClick', () => {
      expect(buttons).toHaveLength(4);
      buttons.at(2).prop('onClick')();
      expect(instance.handleClick.callCount).toBe(1);
      expect(instance.handleClick.lastCall.args).toEqual([2]);
    });

    test('prev button onClick calls handleClick', () => {
      expect(buttons).toHaveLength(4);
      buttons.at(0).prop('onClick')();
      expect(instance.handleClick.callCount).toBe(1);
      expect(instance.handleClick.lastCall.args).toEqual([2]);
    });

    test('next button onClick calls handleClick', () => {
      expect(buttons).toHaveLength(4);
      buttons.at(3).prop('onClick')();
      expect(instance.handleClick.callCount).toBe(1);
      expect(instance.handleClick.lastCall.args).toEqual([4]);
    });
  });
});
