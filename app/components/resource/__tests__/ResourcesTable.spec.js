import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';
import Table from 'react-bootstrap/lib/Table';

import Immutable from 'seamless-immutable';
import {
  UnconnectedResourcesTable as ResourcesTable,
} from 'components/resource/ResourcesTable';
import ResourcesTableItem from 'components/resource/ResourcesTableItem';
import Reservation from 'fixtures/Reservation';
import Resource, { openingHours } from 'fixtures/Resource';

describe('Container: ResourcesTable', () => {
  const currentReservation = Reservation.build(
    { reserverName: 'current' },
    { startTime: moment().subtract(20, 'minutes') }
  );
  const nextReservation = Reservation.build(
    { reserverName: 'next' },
    { startTime: moment().add(2, 'hours') }
  );
  const resource1 = Resource.build({
    openingHours,
    reservations: [currentReservation, nextReservation],
  });
  const resource2 = Resource.build({ reservations: [nextReservation], openingHours });
  const defaultProps = {
    resources: Immutable([
      resource1,
      resource2,
    ]),
  };

  const getWrapper = (extraProps) => shallow(
    <ResourcesTable {...defaultProps} {...extraProps} />
  );

  describe('with resources', () => {
    let wrapper;

    before(() => {
      wrapper = getWrapper();
    });

    it('renders a Table element', () => {
      expect(wrapper.is(Table)).to.be.true;
    });

    describe('table header', () => {
      let theadWrapper;
      let trWrapper;
      let thWrapper;

      before(() => {
        theadWrapper = wrapper.children().filter('thead');
        trWrapper = theadWrapper.children();
        thWrapper = trWrapper.children();
      });

      it('renders a correct table structure', () => {
        expect(theadWrapper.is('thead')).to.be.true;
        expect(trWrapper.is('tr')).to.be.true;
      });

      it('renders five th elements', () => {
        expect(thWrapper).to.have.length(5);
      });
    });

    describe('table body', () => {
      let tbodyWrapper;

      before(() => {
        tbodyWrapper = wrapper.children().filter('tbody');
      });

      it('exists', () => {
        expect(tbodyWrapper.is('tbody')).to.be.true;
      });

      describe('children', () => {
        let children;
        let resourceComponent1;
        let resourceComponent2;

        before(() => {
          children = tbodyWrapper.children();
          resourceComponent1 = children.at(0);
          resourceComponent2 = children.at(1);
        });

        it('has same length that the amount of resources', () => {
          expect(children).to.have.length(2);
        });

        it('first table item is a ResourcesTableItem component', () => {
          expect(resourceComponent1.is(ResourcesTableItem)).to.be.true;
        });

        it('first table item has correct props', () => {
          expect(resourceComponent1.props()).to.deep.equal({
            currentReservation,
            nextReservation,
            resource: resource1,
          });
        });

        it('second table item has correct props', () => {
          expect(resourceComponent2.props()).to.deep.equal({
            currentReservation: undefined,
            nextReservation,
            resource: resource2,
          });
        });

        it('second table item is a ResourcesTableItem component', () => {
          expect(resourceComponent2.is(ResourcesTableItem)).to.be.true;
        });
      });
    });
  });
  describe('without resources', () => {
    describe('when emptyMessage is given in props', () => {
      let wrapper;

      before(() => {
        wrapper = getWrapper({
          emptyMessage: 'No resources found',
          resources: [],
        });
      });

      it('should display the emptyMessage', () => {
        expect(wrapper.is('p')).to.be.true;
        expect(wrapper.text()).to.equal('No resources found');
      });
    });

    describe('when emptyMessage is not given in props', () => {
      let wrapper;

      before(() => {
        wrapper = getWrapper({ resources: [] });
      });

      it('should render a message telling no resources were found', () => {
        const expected = 'Et ole lisännyt vielä yhtään tilaa itsellesi.';
        expect(wrapper.is('p')).to.be.true;
        expect(wrapper.text()).to.equal(expected);
      });
    });
  });
});
