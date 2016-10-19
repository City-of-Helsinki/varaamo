import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Immutable from 'seamless-immutable';
import moment from 'moment';
import { Link } from 'react-router';

import ReservationAccessCode from 'shared/reservation-access-code';
import TimeRange from 'shared/time-range';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import { getResourcePageUrl } from 'utils/resourceUtils';
import ResourcesTableRow from './ResourcesTableRow';

describe('pages/admin-resources/resources-table/ResourcesTableRow', () => {
  const now = moment();
  const openResourceHours = [{
    opens: now.clone().subtract(2, 'hours').toISOString(),
    closes: now.clone().add(6, 'hours').toISOString(),
  }];
  const resource = Immutable(Resource.build({ openingHours: openResourceHours }));
  const currentReservation = Immutable(Reservation.build(
    { reserverName: 'current' },
    { startTime: now.clone().subtract(30, 'minutes') }
  ));

  const nextReservation = Immutable(Reservation.build(
    { reserverName: 'next' },
    { startTime: now.clone().add(2, 'hours') },
  ));
  const defaultProps = { resource };

  const getWrapper = extraProps => shallow(
    <ResourcesTableRow {...defaultProps} {...extraProps} />
  );
  let withoutReservationsComponent;
  let currentReservationComponent;
  let nextReservationComponent;
  let currentAndNextReservationComponent;
  let components;

  before(() => {
    withoutReservationsComponent = getWrapper();
    currentReservationComponent = getWrapper({ currentReservation });
    nextReservationComponent = getWrapper({ nextReservation });
    currentAndNextReservationComponent = getWrapper({
      currentReservation,
      nextReservation,
    });
    components = {
      currentAndNextReservationComponent,
      currentReservationComponent,
      nextReservationComponent,
      withoutReservationsComponent,
    };
  });

  describe('rendering', () => {
    [
      ['without reservations', 'withoutReservationsComponent'],
      ['with next reservation', 'nextReservationComponent'],
      ['with current reservation', 'currentReservationComponent'],
      ['with current and next reservation', 'currentAndNextReservationComponent'],
    ].forEach((componentTuple) => {
      describe(`resource ${componentTuple[0]}`, () => {
        let component;
        let expectedReservation;

        before(() => {
          component = components[componentTuple[1]];
          expectedReservation = component === nextReservationComponent ?
            nextReservation :
            currentReservation;
        });

        it('renders a tr element', () => {
          expect(component.is('tr')).to.be.true;
        });

        it('has five td elements as children', () => {
          const children = component.children();
          expect(children).to.have.length(5);
          expect(children.filter('td')).to.have.length(5);
        });

        describe('name element', () => {
          let tdComponent;

          before(() => {
            tdComponent = component.find('.resource-table-row.name');
          });

          it('exists', () => {
            expect(tdComponent).to.have.length(1);
          });

          it('contains a Link element with correct to and resource name', () => {
            expect(tdComponent.children().is(Link)).to.be.true;
            const props = tdComponent.children().props();
            expect(props.to).to.equal(getResourcePageUrl(resource));
            expect(props.children).to.equal(resource.name.fi);
          });
        });

        if (componentTuple[1] === 'withoutReservationsComponent') {
          it('availability tr exists and says "Suljettu" if resource is already closed', () => {
            const openResource = Immutable(Resource.build({
              openingHours: [{
                opens: now.clone().subtract(6, 'hours').toISOString(),
                closes: now.clone().subtract(1, 'hours').toISOString(),
              }],
            }));
            const customWrapper = getWrapper({ resource: openResource });
            expect(customWrapper.find('.resource-table-row.availability')).to.have.length(1);
            expect(customWrapper.find('.resource-table-row.availability').prop('children'))
              .to.equal('Suljettu');
          });

          it('availability tr exists and says "Suljettu" if resource openingHours are null', () => {
            const openResource = Immutable(Resource.build({
              openingHours: [{
                opens: null,
                closes: null,
              }],
            }));
            const customWrapper = getWrapper({ resource: openResource });
            expect(customWrapper.find('.resource-table-row.availability')).to.have.length(1);
            expect(customWrapper.find('.resource-table-row.availability').prop('children'))
              .to.equal('Suljettu');
          });

          it('availability tr exists and is the amount of free time till resource closes', () => {
            expect(component.find('.resource-table-row.availability')).to.have.length(1);
            expect(component.find('.resource-table-row.availability').prop('children'))
              .to.equal('6 h heti');
          });

          it('reservation range tr exists and is empty', () => {
            expect(component.find('.resource-table-row.reservation-range')).to.have.length(1);
            expect(component.find('.resource-table-row.reservation-range').prop('children'))
              .to.be.undefined;
          });

          it('reserver tr exists and is empty', () => {
            expect(component.find('.resource-table-row.reserver')).to.have.length(1);
            expect(component.find('.resource-table-row.reserver').prop('children')).to.be.undefined;
          });

          it('comments tr exists and is empty', () => {
            expect(component.find('.resource-table-row.comments')).to.have.length(1);
            expect(component.find('.resource-table-row.comments').prop('children')).to.be.undefined;
          });
        } else {
          if (componentTuple[1] === 'nextReservationComponent') {
            describe('availability element', () => {
              let tdComponent;

              before(() => {
                tdComponent = component.find('.resource-table-row.availability');
              });

              it('exists', () => {
                expect(tdComponent).to.have.length(1);
              });

              it('contains the amount of availability time', () => {
                expect(tdComponent.prop('children')).to.equal('2 h heti');
              });

              it('exists and is closed if resource is not yet opened', () => {
                const openResource = Immutable(Resource.build({
                  openingHours: [{
                    opens: now.clone().add(1, 'hours').toISOString(),
                    closes: now.clone().add(5, 'hours').toISOString(),
                  }],
                }));
                const customWrapper = getWrapper({
                  nextReservation,
                  resource: openResource,
                });
                expect(customWrapper.find('.resource-table-row.availability')).to.have.length(1);
                expect(customWrapper.find('.resource-table-row.availability').prop('children'))
                  .to.equal('Suljettu');
              });
            });
          } else {
            describe('availability element', () => {
              let tdComponent;

              before(() => {
                tdComponent = component.find('.resource-table-row.availability');
              });

              it('exists', () => {
                expect(tdComponent).to.have.length(1);
              });

              it('has reserved class', () => {
                expect(tdComponent.prop('className')).to.contain('reserved');
              });

              it('contains Varattu', () => {
                expect(tdComponent.prop('children')).to.equal('Varattu');
              });
            });
          }
          describe('reservation range element', () => {
            let tdComponent;

            before(() => {
              tdComponent = component.find('.resource-table-row.reservation-range');
            });

            it('exists', () => {
              expect(tdComponent).to.have.length(1);
            });

            it('contains a TimeRange element with correct props', () => {
              const timeRangeComponent = tdComponent.find(TimeRange);
              expect(timeRangeComponent.prop('begin')).to.equal(expectedReservation.begin);
              expect(timeRangeComponent.prop('dateFormat')).to.equal(' ');
              expect(timeRangeComponent.prop('end')).to.equal(expectedReservation.end);
            });
          });

          describe('reserver name', () => {
            let tdComponent;

            before(() => {
              tdComponent = component.find('.resource-table-row.reserver');
            });

            it('exists', () => {
              expect(tdComponent).to.have.length(1);
            });

            it('contains the reserver name if it exist', () => {
              expect(tdComponent.text()).to.contain(expectedReservation.reserverName);
            });

            it('renders ReservationAccessCode component', () => {
              const reservationAccessCode = component.find(ReservationAccessCode);
              expect(reservationAccessCode.length).to.equal(1);
            });
          });

          describe('comments element', () => {
            let tdComponent;

            before(() => {
              tdComponent = component.find('.resource-table-row.comments');
            });

            it('exists', () => {
              expect(tdComponent).to.have.length(1);
            });

            it('contains the reserver name', () => {
              expect(tdComponent.prop('children')).to.contain(expectedReservation.comments);
            });
          });
        }
      });
    });
  });

  describe('getReserverName', () => {
    let wrapper;
    let instance;

    before(() => {
      wrapper = getWrapper();
      instance = wrapper.instance();
    });

    it('returns reserverName if it exists', () => {
      const reservation = Reservation.build({
        reserverName: 'reserverName',
        user: {
          displayName: 'myName',
          email: 'my@email.com',
        },
      });
      expect(instance.getReserverName(reservation)).to.equal(reservation.reserverName);
    });

    it('returns displayName if reserverName does not exists', () => {
      const reservation = Reservation.build({
        reserverName: null,
        user: {
          displayName: 'myName',
          email: 'my@email.com',
        },
      });
      expect(instance.getReserverName(reservation)).to.equal(reservation.user.displayName);
    });

    it('returns email if displayName or reserverName do not exists', () => {
      const reservation = Reservation.build({
        reserverName: null,
        user: {
          displayName: '',
          email: 'my@email.com',
        },
      });
      expect(instance.getReserverName(reservation)).to.equal(reservation.user.email);
    });
  });
});
