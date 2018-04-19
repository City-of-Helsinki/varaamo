import { expect } from 'chai';
import React from 'react';
import Loader from 'react-loader';
import { browserHistory } from 'react-router';
import simple from 'simple-mock';

import PageWrapper from 'pages/PageWrapper';
import { shallowWithIntl } from 'utils/testUtils';
import { UnconnectedHomePage as HomePage } from './HomePage';
import HomeSearchBox from './HomeSearchBox';

describe('pages/home/HomePage', () => {
  const defaultProps = {
    actions: {
      fetchPurposes: simple.stub(),
    },
    isFetchingPurposes: false,
    purposes: [{
      label: 'Purpose 1',
      value: 'purpose-1',
    }, {
      label: 'Purpose 2',
      value: 'purpose-2',
    }, {
      label: 'Purpose 3',
      value: 'purpose-3',
    }, {
      label: 'Purpose 4',
      value: 'purpose-4',
    }],
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<HomePage {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    it('renders PageWrapper with correct props', () => {
      const pageWrapper = getWrapper().find(PageWrapper);
      expect(pageWrapper).to.have.length(1);
      expect(pageWrapper.prop('className')).to.equal('app-HomePageContent');
      expect(pageWrapper.prop('title')).to.equal('HomePage.title');
    });

    it('renders HomeSearchBox with correct props', () => {
      const wrapper = getWrapper();
      const instance = wrapper.instance();
      const homeSearchBox = wrapper.find(HomeSearchBox);
      expect(homeSearchBox).to.have.length(1);
      expect(homeSearchBox.prop('onSearch')).to.equal(instance.handleSearch);
    });

    describe('Loader', () => {
      it('renders Loader with correct props when not fetching purposes', () => {
        const loader = getWrapper().find(Loader);
        expect(loader.length).to.equal(1);
        expect(loader.at(0).prop('loaded')).to.be.true;
      });

      it('renders Loader with correct props when fetching purposes', () => {
        const loader = getWrapper({ isFetchingPurposes: true }).find(Loader);
        expect(loader.length).to.equal(1);
        expect(loader.at(0).prop('loaded')).to.be.false;
      });

      it('renders purpose banners', () => {
        const banners = getWrapper().find('.app-HomePageContent__banner');
        expect(banners.length).to.equal(defaultProps.purposes.length);
      });
    });

    describe('Purpose banners onClick', () => {
      let buttons;
      let instance;

      before(() => {
        const wrapper = getWrapper();
        instance = wrapper.instance();
        instance.handleBannerClick = simple.mock();
        buttons = wrapper.find('.app-HomePageContent__button');
      });

      after(() => {
        simple.restore();
      });

      it('calls handleBannerClick on purpose banner onClick', () => {
        expect(buttons.length).to.equal(defaultProps.purposes.length);
        expect(buttons.at(0).prop('onClick')).to.exist;
        buttons.at(0).prop('onClick')();
        expect(instance.handleBannerClick.callCount).to.equal(1);
      });
    });
  });

  describe('componentDidMount', () => {
    function callComponentDidMount(props, extraActions) {
      const actions = { ...defaultProps.actions, ...extraActions };
      const instance = getWrapper({ ...props, actions }).instance();
      instance.componentDidMount();
    }

    it('fetches purposes', () => {
      const fetchPurposes = simple.mock();
      callComponentDidMount({}, { fetchPurposes });
      expect(fetchPurposes.callCount).to.equal(1);
    });
  });

  describe('handleSearch', () => {
    const value = 'some value';
    const expectedPath = `/search?search=${value}`;
    let browserHistoryMock;

    before(() => {
      const instance = getWrapper().instance();
      browserHistoryMock = simple.mock(browserHistory, 'push');
      instance.handleSearch(value);
    });

    after(() => {
      simple.restore();
    });

    it('calls browserHistory push with correct path', () => {
      expect(browserHistoryMock.callCount).to.equal(1);
      expect(browserHistoryMock.lastCall.args).to.deep.equal([expectedPath]);
    });
  });

  describe('handleBannerClick', () => {
    const purpose = 'some purpose';
    const expectedPath = `/search?purpose=${purpose}`;
    let browserHistoryMock;

    before(() => {
      const instance = getWrapper().instance();
      browserHistoryMock = simple.mock(browserHistory, 'push');
      instance.handleBannerClick(purpose);
    });

    after(() => {
      simple.restore();
    });

    it('calls browserHistory push with correct path', () => {
      expect(browserHistoryMock.callCount).to.equal(1);
      expect(browserHistoryMock.lastCall.args).to.deep.equal([expectedPath]);
    });
  });
});
