import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { Link } from 'react-router';

import ResourceInfoContainer, { ResourceInfo, selector } from './ResourceInfoContainer';

function getState() {
  return {
    data: {
      resources: {
        123456: {
          id: '123456',
          name: { fi: 'Resource Name' },
          peopleCapacity: 9,
          extra: 'attribute',
          isFavorite: false,
        },
      },
    },
  };
}

describe('shared/availability-view/ResourceInfoContainer', () => {
  describe('container', () => {
    function getWrapper(props) {
      const defaults = { date: '2017-01-01', id: '123456', store: { getState } };
      return shallow(<ResourceInfoContainer {...defaults} {...props} />);
    }

    it('renders a ResourceInfo', () => {
      const wrapper = getWrapper();
      expect(wrapper.is(ResourceInfo)).to.be.true;
    });
  });

  describe('component', () => {
    function getWrapper(props) {
      const defaults = {
        date: '2017-01-02',
        id: 'r-1',
        isFavorite: false,
        name: 'Resource name',
        peopleCapacity: 19,
      };
      return shallow(<ResourceInfo {...defaults} {...props} />);
    }

    it('renders a div.resource-info', () => {
      const wrapper = getWrapper();
      expect(wrapper.is('div.resource-info')).to.be.true;
    });

    it('renders the name and link to resource page', () => {
      const date = '2017-02-03';
      const link = getWrapper({ date, id: 'r-1', name: 'Room 1' }).find(Link);
      expect(link).to.have.length(1);
      expect(link.prop('to')).to.equal(`/resources/r-1?date=${date}`);
      expect(link.prop('children')).to.equal('Room 1');
    });

    it('renders the capacity', () => {
      const capacity = getWrapper({ peopleCapacity: 3 }).find('.capacity');
      expect(capacity).to.have.length(1);
      expect(capacity.text()).to.contain('3');
    });
  });

  describe('selector', () => {
    function getSelected(props) {
      const defaults = { id: '123456' };
      return selector()(getState(), { ...defaults, ...props });
    }

    it('returns resource info', () => {
      const actual = getSelected();
      expect(actual).to.deep.equal({
        name: 'Resource Name',
        peopleCapacity: 9,
      });
    });
  });
});
