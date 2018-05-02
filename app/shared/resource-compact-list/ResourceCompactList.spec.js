import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Immutable from 'seamless-immutable';

import ResourceCard from 'shared/resource-card';
import { UnconnectedResourceCompactList as ResourceCompactList } from './ResourceCompactList';

describe('shared/resource-list/ResourceCompactList', () => {
  const defaultProps = {
    resourceIds: Immutable(['resource-1', 'resource-2']),
    date: '2017-01-01',
    location: {},
  };

  function getWrapper(extraProps) {
    return shallow(<ResourceCompactList {...defaultProps} {...extraProps} />);
  }

  describe('with resourceIds', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = getWrapper();
    });

    it('renders a div with correct className', () => {
      const div = wrapper.find('div.app-ResourceCompactList');
      expect(div.length).to.equal(1);
    });

    it('renders first ResourceCard', () => {
      const resourceCard = wrapper.find(ResourceCard);
      expect(resourceCard.length).to.equal(1);
      expect(resourceCard.prop('resourceId')).to.equal('resource-1');
    });

    it('passes date prop to ResourceCard', () => {
      const resourceCard = wrapper.find(ResourceCard);
      expect(resourceCard.length).to.equal(1);
      expect(resourceCard.prop('date')).to.equal(defaultProps.date);
    });

    it('renders second ResourceCard if resourcePosition is 1', () => {
      const instance = wrapper.instance();
      instance.setState({
        resourcePosition: 1,
      });
      wrapper.update();
      const resourceCard = wrapper.find(ResourceCard);
      expect(resourceCard.length).to.equal(1);
      expect(resourceCard.prop('resourceId')).to.equal('resource-2');
    });

    it('passes stacked prop to ResourceCard if more than one resource', () => {
      const resourceCard = wrapper.find(ResourceCard);
      expect(resourceCard.prop('stacked')).to.be.true;
    });

    it('does not pass stacked prop to ResourceCard if more only one resource', () => {
      const resourceCard = getWrapper({ resourceIds: ['resource-1'] }).find(ResourceCard);
      expect(resourceCard.prop('stacked')).to.be.false;
    });

    it('renders left arrow if resourcePosition state is not 0', () => {
      const instance = wrapper.instance();
      instance.setState({
        resourcePosition: 1,
      });
      wrapper.update();
      const leftArrow = wrapper.find('.app-ResourceCompactList_arrow-left');
      expect(leftArrow.length).to.equal(1);
    });

    it('renders left arrow if resourcePosition state is 0', () => {
      const instance = wrapper.instance();
      instance.setState({
        resourcePosition: 0,
      });
      wrapper.update();
      const leftArrow = wrapper.find('.app-ResourceCompactList_arrow-left');
      expect(leftArrow.length).to.equal(1);
    });

    it('left arrow has correct onClick prop', () => {
      const instance = wrapper.instance();
      instance.setState({
        resourcePosition: 1,
      });
      wrapper.update();
      const leftArrow = wrapper.find('.app-ResourceCompactList_arrow-left');
      expect(leftArrow.prop('onClick')).to.equal(instance.onPreviousResource);
    });

    it('renders right arrow if resourcePosition state is 0', () => {
      const instance = wrapper.instance();
      instance.setState({
        resourcePosition: 0,
      });
      wrapper.update();
      const rightArrow = wrapper.find('.app-ResourceCompactList_arrow-right');
      expect(rightArrow.length).to.equal(1);
    });

    it('renders right arrow if resourcePosition state is last resource position', () => {
      const instance = wrapper.instance();
      instance.setState({
        resourcePosition: 1,
      });
      wrapper.update();
      const rightArrow = wrapper.find('.app-ResourceCompactList_arrow-right');
      expect(rightArrow.length).to.equal(1);
    });

    it('right arrow has correct onClick prop', () => {
      const instance = wrapper.instance();
      instance.setState({
        resourcePosition: 0,
      });
      wrapper.update();
      const rightArrow = wrapper.find('.app-ResourceCompactList_arrow-right');
      expect(rightArrow.prop('onClick')).to.equal(instance.onNextResource);
    });
  });

  describe('componentWillReceiveProps', () => {
    it('sets resourcePosition to 0', () => {
      const instance = getWrapper().instance();
      instance.setState({
        resourcePosition: 1,
      });
      instance.componentWillReceiveProps();
      expect(instance.state.resourcePosition).to.equal(0);
    });
  });

  describe('onPreviousResource', () => {
    it('decreases resourcePosition by 1', () => {
      const instance = getWrapper().instance();
      instance.setState({
        resourcePosition: 1,
      });
      instance.onPreviousResource();
      expect(instance.state.resourcePosition).to.equal(0);
    });

    it('loops to last position if position is 0', () => {
      const instance = getWrapper().instance();
      instance.setState({
        resourcePosition: 0,
      });
      instance.onPreviousResource();
      expect(instance.state.resourcePosition).to.equal(1);
    });
  });

  describe('onNextResource', () => {
    it('decreases resourcePosition by 1', () => {
      const instance = getWrapper().instance();
      instance.setState({
        resourcePosition: 0,
      });
      instance.onNextResource();
      expect(instance.state.resourcePosition).to.equal(1);
    });

    it('loops to first position if position is last', () => {
      const instance = getWrapper().instance();
      instance.setState({
        resourcePosition: 1,
      });
      instance.onNextResource();
      expect(instance.state.resourcePosition).to.equal(0);
    });
  });
});
