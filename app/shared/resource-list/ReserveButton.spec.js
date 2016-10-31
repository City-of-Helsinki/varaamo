import { expect } from 'chai';
import { shallow } from 'enzyme';
import MockDate from 'mockdate';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { LinkContainer } from 'react-router-bootstrap';
import Immutable from 'seamless-immutable';

import Resource from 'utils/fixtures/Resource';
import { getResourcePageUrl } from 'utils/resourceUtils';
import ReserveButton from './ReserveButton';

describe('shared/resource-list/ReserveButton', () => {
  function getWrapper(props) {
    const defaults = {
      date: '2015-10-10',
      isLoggedIn: false,
      resource: Immutable(Resource.build({
        needManualConfirmation: false,
        reservable: false,
      })),
    };

    return shallow(<ReserveButton {...defaults} {...props} />);
  }

  function testWrapper(props, expectedText) {
    it('renders a LinkContainer to reservation page', () => {
      const linkContainer = getWrapper(props).find(LinkContainer);
      const expectedUrl = getResourcePageUrl(props.resource, props.date);

      expect(linkContainer.length).to.equal(1);
      expect(linkContainer.props().to).to.equal(expectedUrl);
    });

    it(`renders button with text ${expectedText}`, () => {
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

  describe('when date given in props is not in past', () => {
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
              const props = {
                date,
                isLoggedIn,
                resource: Immutable(Resource.build({
                  needManualConfirmation, reservable, reservableBefore,
                })),
              };
              testWrapper(props, 'Tee alustava varaus');
            });

            describe('when resource does not need manual confirmation', () => {
              const needManualConfirmation = false;
              const props = {
                date,
                isLoggedIn,
                resource: Immutable(Resource.build({
                  needManualConfirmation, reservable, reservableBefore,
                })),
              };
              testWrapper(props, 'Varaa');
            });
          });

          describe('when resource is not reservable', () => {
            const reservable = false;
            const props = {
              date,
              isLoggedIn,
              resource: Immutable(Resource.build({ reservable, reservableBefore })),
            };
            testWrapper(props, 'Katso varaustilanne');
          });
        });

        describe('when user is not logged in', () => {
          const isLoggedIn = false;
          const props = {
            date,
            isLoggedIn,
            resource: Immutable(Resource.build({ reservableBefore })),
          };
          testWrapper(props, 'Katso varaustilanne');
        });
      });

      describe('when time limit is before the date in props', () => {
        const reservableBefore = '2016-10-20';

        describe('when user is a regular user', () => {
          const isLoggedIn = true;
          const userPermissions = { isAdmin: false };
          const props = {
            date,
            isLoggedIn,
            resource: Immutable(Resource.build({ reservableBefore, userPermissions })),
          };

          it('renders an empty span', () => {
            const wrapper = getWrapper(props);
            expect(wrapper.equals(<span />)).to.be.true;
          });
        });

        describe('when user is an admin', () => {
          const isLoggedIn = true;
          const userPermissions = { isAdmin: true };
          const props = {
            date,
            isLoggedIn,
            resource: Immutable(Resource.build({ reservableBefore, userPermissions })),
          };
          testWrapper(props, 'Varaa');
        });

        describe('when user is not logged in', () => {
          const isLoggedIn = false;
          const props = {
            date,
            isLoggedIn,
            resource: Immutable(Resource.build({ reservableBefore })),
          };

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
            const props = {
              date,
              isLoggedIn,
              resource: Immutable(Resource.build({
                needManualConfirmation, reservable, reservableBefore,
              })),
            };
            testWrapper(props, 'Tee alustava varaus');
          });

          describe('when resource does not need manual confirmation', () => {
            const needManualConfirmation = false;
            const props = {
              date,
              isLoggedIn,
              resource: Immutable(Resource.build({
                needManualConfirmation, reservable, reservableBefore,
              })),
            };
            testWrapper(props, 'Varaa');
          });
        });

        describe('when resource is not reservable', () => {
          const reservable = false;
          const props = {
            date,
            isLoggedIn,
            resource: Immutable(Resource.build({ reservable, reservableBefore })),
          };
          testWrapper(props, 'Katso varaustilanne');
        });
      });

      describe('when user is not logged in', () => {
        const isLoggedIn = false;
        const props = {
          date,
          isLoggedIn,
          resource: Immutable(Resource.build({ reservableBefore })),
        };
        testWrapper(props, 'Katso varaustilanne');
      });
    });
  });
});
