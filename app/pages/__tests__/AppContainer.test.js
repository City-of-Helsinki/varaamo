import React from 'react';
import { shallow } from 'enzyme';
import simple from 'simple-mock';
import { Helmet } from 'react-helmet';

import Header from '../../../src/domain/header/Header';
import AccessibilityShortcuts from '../../shared/accessibility-shortcuts/AccessibilityShortcuts';
import { getState } from '../../utils/testUtils';
import * as customizationUtils from '../../utils/customizationUtils';
import { selector, UnconnectedAppContainer as AppContainer } from '../AppContainer';

describe('pages/AppContainer', () => {
  function getWrapper(props) {
    const defaults = {
      children: <div id="child-div" />,
      enableGeoposition: () => {},
      fetchUser: () => null,
      location: {},
      userId: null,
      language: 'fi',
      fontSize: 'fontSizeSmall',
      isHighContrast: false,
    };
    return shallow(<AppContainer {...defaults} {...props} />);
  }

  describe('selector', () => {
    const searchResultIds = ['resource-1', 'resourece-2'];

    const defaultProps = {
      location: {
        pathname: '/',
      },
    };

    function getSelected(props = defaultProps) {
      const state = getState({
        auth: {
          userId: 'u-1',
        },
        'ui.search': {
          results: searchResultIds,
          showMap: true,
          unitId: 'search-unit',
        },
        'ui.resourceMap': {
          resourceId: 'selected-resource',
          showMap: false,
          unitId: 'resource-unit',
        },
      });
      return selector(state, props);
    }

    describe('with path in root', () => {
      test('returns userId from state', () => {
        expect(getSelected().userId).toBe('u-1');
      });
    });

    describe('with path in /resources/', () => {
      const customProps = {
        location: {
          pathname: '/resources/qwertyqwerty',
        },
      };
      test('returns userId from state', () => {
        expect(getSelected(customProps).userId).toBe('u-1');
      });
    });
  });

  describe('render', () => {
    const wrapper = getWrapper();

    test('renders Header', () => {
      expect(getWrapper().find(Header)).toHaveLength(1);
    });

    test('renders accessibility shortcuts', () => {
      expect(getWrapper().find(AccessibilityShortcuts)).toHaveLength(1);
    });

    test('renders props.children', () => {
      const children = wrapper.find('#child-div');
      expect(children).toHaveLength(1);
    });

    test('html lang attribute is set correctly for Finnish, Swedish and English', () => {
      const languages = ['fi', 'en', 'sv'];

      languages.forEach((code) => {
        expect(
          getWrapper({ language: code }).find(Helmet).props().htmlAttributes.lang,
        ).toEqual(code);
      });
    });

    test('html class attribute is set correctly for font sizes', () => {
      expect(
        getWrapper().find(Helmet).props().htmlAttributes.class,
      ).toEqual('fontSizeSmall');
    });
  });

  describe('render Espoo/Vantaa custom classname', () => {
    const mockCity = 'ESPOO';

    beforeAll(() => {
      simple.mock(customizationUtils, 'getCustomizationClassName').returnWith(mockCity);
    });

    afterAll(() => {
      simple.restore();
    });

    const getAppWrapper = props => getWrapper(props).find('.app');

    test('render app className normally', () => {
      expect(getAppWrapper().length).toBeGreaterThan(0);
    });

    test('have custom classname for Espoo when specified in config', () => {
      expect(getAppWrapper().prop('className')).toContain(mockCity);
    });
  });

  describe('componentDidMount', () => {
    test('calls removeFacebookAppendedHash', () => {
      const instance = getWrapper().instance();
      simple.mock(instance, 'removeFacebookAppendedHash').returnWith('some text');
      instance.componentDidMount();

      expect(instance.removeFacebookAppendedHash.callCount).toBe(1);
    });

    describe('when user is not logged in', () => {
      test('does not fetch user data', () => {
        const fetchUser = simple.mock();
        const instance = getWrapper({ fetchUser, userId: null }).instance();
        instance.componentDidMount();
        expect(fetchUser.callCount).toBe(0);
      });
    });

    describe('when user is logged in', () => {
      test('fetches user data', () => {
        const fetchUser = simple.mock();
        const userId = 'u-1';
        const instance = getWrapper({ fetchUser, userId }).instance();
        instance.componentDidMount();
        expect(fetchUser.callCount).toBe(1);
        expect(fetchUser.lastCall.arg).toBe(userId);
      });
    });
  });

  describe('componentWillUpdate', () => {
    describe('when userId does not change', () => {
      test('does not fetch user data', () => {
        const fetchUser = simple.mock();
        const userId = 'u-1';
        const instance = getWrapper({ fetchUser, userId }).instance();
        instance.componentWillUpdate({ userId });
        expect(fetchUser.callCount).toBe(0);
      });
    });

    describe('when userId does change', () => {
      test('fetches user data if new userId is not null', () => {
        const fetchUser = simple.mock();
        const userId = 'u-1';
        const newId = 'u-99';
        const instance = getWrapper({ fetchUser, userId }).instance();
        instance.componentWillUpdate({ userId: newId });
        expect(fetchUser.callCount).toBe(1);
        expect(fetchUser.lastCall.arg).toBe(newId);
      });

      test('does not fetch user data if new userId is null', () => {
        const fetchUser = simple.mock();
        const userId = 'u-1';
        const newId = null;
        const instance = getWrapper({ fetchUser, userId }).instance();
        instance.componentWillUpdate({ userId: newId });
        expect(fetchUser.callCount).toBe(0);
      });
    });
  });

  describe('removeFacebookAppendedHash', () => {
    beforeEach(() => {
      window.location.hash = '_=_';
    });

    test('removes "_=_" hash if it exists', () => {
      const instance = getWrapper().instance();
      instance.removeFacebookAppendedHash();
      expect(window.location.hash).toEqual(expect.not.arrayContaining(['_=_']));
    });
  });
});
