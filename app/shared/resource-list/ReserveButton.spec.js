import { expect } from 'chai';
import MockDate from 'mockdate';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { LinkContainer } from 'react-router-bootstrap';
import Immutable from 'seamless-immutable';

import Resource from 'utils/fixtures/Resource';
import { getResourcePageUrl } from 'utils/resourceUtils';
import { shallowWithIntl } from 'utils/testUtils';
import ReserveButton from './ReserveButton';

describe('shared/resource-list/ReserveButton', () => {
  function getProps(props, resourceProps) {
    const openingHours = resourceProps.openingHours || [{
      opens: `${props.date}T12:00:00+03:00`,
      closes: `${props.date}T18:00:00+03:00`,
    }];
    const resource = Immutable(Resource.build(
      Object.assign({}, resourceProps, { openingHours })
    ));
    return Object.assign({}, props, { resource });
  }

  function getWrapper(props) {
    const defaults = {
      date: '2015-10-10',
      isLoggedIn: false,
      resource: Immutable(Resource.build()),
    };

    return shallowWithIntl(<ReserveButton {...defaults} {...props} />);
  }

  function makeTests(props, expectedText) {
    it('renders a LinkContainer to reservation page', () => {
      const linkContainer = getWrapper(props).find(LinkContainer);
      const expectedUrl = getResourcePageUrl(props.resource, props.date);

      expect(linkContainer.length).to.equal(1);
      expect(linkContainer.props().to).to.equal(expectedUrl);
    });

    it(`renders button and message with id ${expectedText}`, () => {
      const button = getWrapper(props).find(Button);
      expect(button.prop('children')).to.equal(expectedText);
    });
  }

  describe('when date given in props is in the past', () => {
    const now = '2016-10-10T06:00:00+03:00';
    const date = '2016-10-09';

    beforeEach(() => {
      MockDate.set(now);
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('renders an empty span', () => {
      const wrapper = getWrapper({ date });
      expect(wrapper.equals(<span />)).to.be.true;
    });
  });

  describe('when resource is closed', () => {
    it('renders an empty span', () => {
      const wrapper = getWrapper({}, { openingHours: [] });
      expect(wrapper.equals(<span />)).to.be.true;
    });
  });

  describe('when resource is open and date given in props is not in past', () => {
    const now = '2016-10-10T06:00:00+03:00';
    const date = '2016-11-10';

    before(() => {
      MockDate.set(now);
    });

    after(() => {
      MockDate.reset();
    });

    describe('when resource has time limit for reservations', () => {
      describe('when time limit is after the date in props', () => {
        const reservableBefore = '2016-12-20';

        describe('when user is logged in', () => {
          const isLoggedIn = true;

          describe('when resource is reservable', () => {
            const reservable = true;

            describe('when resource needs manual confirmation', () => {
              const needManualConfirmation = true;
              const resourceProps = { needManualConfirmation, reservable, reservableBefore };
              const props = getProps({ date, isLoggedIn }, resourceProps);
              makeTests(props, 'ReserveButton.makePreliminaryReservation');
            });

            describe('when resource does not need manual confirmation', () => {
              const needManualConfirmation = false;
              const resourceProps = { needManualConfirmation, reservable, reservableBefore };
              const props = getProps({ date, isLoggedIn }, resourceProps);
              makeTests(props, 'ReserveButton.makeRegularReservation');
            });
          });

          describe('when resource is not reservable', () => {
            const reservable = false;
            const resourceProps = { reservable, reservableBefore };
            const props = getProps({ date, isLoggedIn }, resourceProps);
            makeTests(props, 'ReserveButton.notReservableText');
          });
        });

        describe('when user is not logged in', () => {
          const isLoggedIn = false;
          const resourceProps = { reservableBefore };
          const props = getProps({ date, isLoggedIn }, resourceProps);
          makeTests(props, 'ReserveButton.notReservableText');
        });
      });

      describe('when time limit is before the date in props', () => {
        const reservableBefore = '2016-10-20';

        describe('when user is a regular user', () => {
          const isLoggedIn = true;
          const userPermissions = { isAdmin: false };
          const resourceProps = { reservableBefore, userPermissions };
          const props = getProps({ date, isLoggedIn }, resourceProps);

          it('renders an empty span', () => {
            const wrapper = getWrapper(props);
            expect(wrapper.equals(<span />)).to.be.true;
          });
        });

        describe('when user is an admin', () => {
          const isLoggedIn = true;
          const userPermissions = { isAdmin: true };
          const resourceProps = { reservableBefore, userPermissions };
          const props = getProps({ date, isLoggedIn }, resourceProps);
          makeTests(props, 'ReserveButton.makeRegularReservation');
        });

        describe('when user is not logged in', () => {
          const isLoggedIn = false;
          const resourceProps = { reservableBefore };
          const props = getProps({ date, isLoggedIn }, resourceProps);

          it('renders an empty span', () => {
            const wrapper = getWrapper(props);
            expect(wrapper.equals(<span />)).to.be.true;
          });
        });
      });
    });

    describe('when resource does not have time limit for reservations', () => {
      const reservableBefore = undefined;

      describe('when user is logged in', () => {
        const isLoggedIn = true;

        describe('when resource is reservable', () => {
          const reservable = true;

          describe('when resource needs manual confirmation', () => {
            const needManualConfirmation = true;
            const resourceProps = { needManualConfirmation, reservable, reservableBefore };
            const props = getProps({ date, isLoggedIn }, resourceProps);
            makeTests(props, 'ReserveButton.makePreliminaryReservation');
          });

          describe('when resource does not need manual confirmation', () => {
            const needManualConfirmation = false;
            const resourceProps = { needManualConfirmation, reservable, reservableBefore };
            const props = getProps({ date, isLoggedIn }, resourceProps);
            makeTests(props, 'ReserveButton.makeRegularReservation');
          });
        });

        describe('when resource is not reservable', () => {
          const reservable = false;
          const resourceProps = { reservable, reservableBefore };
          const props = getProps({ date, isLoggedIn }, resourceProps);
          makeTests(props, 'ReserveButton.notReservableText');
        });
      });

      describe('when user is not logged in', () => {
        const isLoggedIn = false;
        const resourceProps = { reservableBefore };
        const props = getProps({ date, isLoggedIn }, resourceProps);
        makeTests(props, 'ReserveButton.notReservableText');
      });
    });
  });
});
