import { expect } from 'chai';
import moment from 'moment';
import React from 'react';
import Table from 'react-bootstrap/lib/Table';
import Immutable from 'seamless-immutable';

import Reservation from 'utils/fixtures/Reservation';
import Resource, { openingHours } from 'utils/fixtures/Resource';
import { shallowWithIntl } from 'utils/testUtils';
import { UnconnectedResourcesTable as ResourcesTable } from './ResourcesTable';
import ResourcesTableRow from './ResourcesTableRow';

describe('pages/admin-resources/resources-table/ResourcesTable', () => {
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

  function getWrapper(extraProps) {
    return shallowWithIntl(<ResourcesTable {...defaultProps} {...extraProps} />);
  }

  it('renders a Table element', () => {
    expect(getWrapper().find(Table).length).to.equal(1);
  });

  describe('table header', () => {
    function getTHeadWrapper() {
      return getWrapper().find('thead');
    }

    it('is rendered', () => {
      expect(getTHeadWrapper()).to.have.length(1);
    });

    it('renders five th elements', () => {
      expect(getTHeadWrapper().find('th')).to.have.length(5);
    });
  });

  describe('table body', () => {
    function getTBodyWrapper() {
      return getWrapper().find('tbody');
    }

    it('exists', () => {
      expect(getTBodyWrapper().is('tbody')).to.be.true;
    });

    describe('children', () => {
      let children;
      let resourceComponent1;
      let resourceComponent2;

      before(() => {
        children = getTBodyWrapper().children();
        resourceComponent1 = children.at(0);
        resourceComponent2 = children.at(1);
      });

      it('has same length that the amount of resources', () => {
        expect(children).to.have.length(2);
      });

      it('first table item is a ResourcesTableRow component', () => {
        expect(resourceComponent1.is(ResourcesTableRow)).to.be.true;
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

      it('second table item is a ResourcesTableRow component', () => {
        expect(resourceComponent2.is(ResourcesTableRow)).to.be.true;
      });
    });
  });
});
