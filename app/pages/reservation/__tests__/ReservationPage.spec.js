import React from 'react';
import Loader from 'react-loader';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import PageWrapper from '../../PageWrapper';
import { shallowWithIntl } from '../../../utils/testUtils';
import Reservation from '../../../utils/fixtures/Reservation';
import Resource from '../../../utils/fixtures/Resource';
import Unit from '../../../utils/fixtures/Unit';
import User from '../../../utils/fixtures/User';
import ReservationConfirmation from '../reservation-confirmation/ReservationConfirmation';
import ReservationInformation from '../reservation-information/ReservationInformation';
import ReservationPhases from '../reservation-phases/ReservationPhases';
import ReservationTime from '../reservation-time/ReservationTime';
import { UnconnectedReservationPage as ReservationPage } from '../ReservationPage';

describe('pages/reservation/ReservationPage', () => {
  const resource = Immutable(Resource.build());
  const history = {
    replace: () => { },
  };
  const defaultProps = {
    history,
    actions: {
      clearReservations: simple.mock(),
      closeReservationSuccessModal: simple.mock(),
      fetchResource: simple.mock(),
      openResourceTermsModal: simple.mock(),
      putReservation: simple.mock(),
      postReservation: simple.mock(),
    },
    date: '2016-10-10',
    isAdmin: false,
    isStaff: false,
    isFetchingResource: false,
    isMakingReservations: false,
    location: {},
    match: { search: '' },
    reservationToEdit: null,
    reservationCreated: null,
    reservationEdited: null,
    resource,
    selected: [
      {
        begin: '2016-10-10T10:00:00+03:00',
        end: '2016-10-10T11:00:00+03:00',
        resource: resource.id,
      },
      {
        begin: '2016-10-10T11:00:00+03:00',
        end: '2016-10-10T12:00:00+03:00',
        resource: resource.id,
      },
    ],
    unit: Immutable(Unit.build()),
    user: Immutable(User.build()),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationPage {...defaultProps} {...extraProps} />);
  }

  describe('PageWrapper title', () => {
    test(
      'renders new reservation title when reservationToEdit and reservationEdited is empty',
      () => {
        const pageWrapper = getWrapper({
          reservationToEdit: null,
          reservationEdited: null,
        }).find(PageWrapper);

        expect(pageWrapper).toHaveLength(1);
        expect(pageWrapper.prop('title')).toBe('ReservationPage.newReservationTitle');
      }
    );

    test('renders edit reservation title when reservationToEdit not empty', () => {
      const pageWrapper = getWrapper({
        reservationToEdit: Reservation.build(),
      }).find(PageWrapper);

      expect(pageWrapper).toHaveLength(1);
      expect(pageWrapper.prop('title')).toBe('ReservationPage.editReservationTitle');
    });

    test('renders edit reservation title when reservationEdited not empty', () => {
      const pageWrapper = getWrapper({
        reservationEdited: Reservation.build(),
      }).find(PageWrapper);

      expect(pageWrapper).toHaveLength(1);
      expect(pageWrapper.prop('title')).toBe('ReservationPage.editReservationTitle');
    });
  });

  describe('Loader', () => {
    test('prop loaded true when resource not empty', () => {
      const loader = getWrapper({
        resource,
      }).find(Loader);

      expect(loader).toHaveLength(1);
      expect(loader.prop('loaded')).toBe(true);
    });

    test('not rendered when resource empty', () => {
      const loader = getWrapper({
        resource: {},
      }).find(Loader);

      expect(loader).toHaveLength(0);
    });
  });

  describe('ReservationPhases', () => {
    test('renders correct props when reservationToEdit null', () => {
      const reservationPhases = getWrapper({
        reservationToEdit: null,
      }).find(ReservationPhases);
      expect(reservationPhases).toHaveLength(1);
      expect(reservationPhases.prop('currentPhase')).toBe('information');
      expect(reservationPhases.prop('isEditing')).toBe(false);
    });

    test('renders correct props when reservationToEdit not null', () => {
      const reservationPhases = getWrapper({
        reservationToEdit: Reservation.build(),
      }).find(ReservationPhases);
      expect(reservationPhases).toHaveLength(1);
      expect(reservationPhases.prop('currentPhase')).toBe('time');
      expect(reservationPhases.prop('isEditing')).toBe(true);
    });
  });

  describe('ReservationTime', () => {
    test('renders ReservationTime when reservationToEdit not empty', () => {
      const reservationTime = getWrapper({
        reservationToEdit: Reservation.build(),
      }).find(ReservationTime);
      expect(reservationTime).toHaveLength(1);
    });

    test('does not render ReservationTime when reservationToEdit is empty', () => {
      const reservationTime = getWrapper({
        reservationToEdit: null,
      }).find(ReservationTime);
      expect(reservationTime).toHaveLength(0);
    });
  });

  describe('ReservationInformation', () => {
    test(
      'renders ReservationInformation when view is information and selected not empty',
      () => {
        const reservationInformation = getWrapper().find(ReservationInformation);
        expect(reservationInformation).toHaveLength(1);
      }
    );

    test(
      'does not render ReservationInformation by default when reservationToEdit is not empty',
      () => {
        const reservationInformation = getWrapper({
          reservationToEdit: Reservation.build(),
        }).find(ReservationInformation);
        expect(reservationInformation).toHaveLength(0);
      }
    );
  });

  describe('ReservationConfirmation', () => {
    test('does not render ReservationInformation by default', () => {
      const reservationConfirmation = getWrapper().find(ReservationConfirmation);
      expect(reservationConfirmation).toHaveLength(0);
    });
  });

  describe('constructor', () => {
    test('state view is time when prop reservationToEdit not empty', () => {
      const instance = getWrapper({
        reservationToEdit: Reservation.build(),
      }).instance();
      expect(instance.state.view).toBe('time');
    });

    test('state view is information when prop reservationToEdit empty', () => {
      const instance = getWrapper({
        reservationToEdit: null,
      }).instance();
      expect(instance.state.view).toBe('information');
    });
  });

  describe('componentDidMount', () => {
    describe('when reservations and selected empty', () => {
      let historyMock;

      beforeAll(() => {
        historyMock = simple.mock(history, 'replace');
        const instance = getWrapper({
          reservationCreated: null,
          reservationEdited: null,
          reservationToEdit: null,
          selected: [],
        }).instance();
        instance.componentDidMount();
      });

      afterAll(() => {
        simple.restore();
      });

      test('calls history.replace() with /my-reservations', () => {
        const expectedPath = '/my-reservations';
        expect(historyMock.callCount).toBe(1);
        expect(historyMock.lastCall.args).toEqual([expectedPath]);
      });
    });

    describe('when reservations and selected empty and location search has resource', () => {
      let historyMock;

      beforeAll(() => {
        historyMock = simple.mock(history, 'replace');
        const instance = getWrapper({
          location: {
            search: `?resource=${resource.id}`,
          },
          reservationCreated: null,
          reservationEdited: null,
          reservationToEdit: null,
          selected: [],
        }).instance();
        instance.componentDidMount();
      });

      afterAll(() => {
        simple.restore();
      });

      test('calls history.replace() with /my-reservations', () => {
        const expectedPath = `/resources/${resource.id}`;
        expect(historyMock.callCount).toBe(1);
        expect(historyMock.lastCall.args).toEqual([expectedPath]);
      });
    });

    describe('when selected not empty', () => {
      let instance;
      beforeAll(() => {
        instance = getWrapper({
          selected: defaultProps.selected,
        }).instance();
        instance.fetchResource = simple.mock();
        instance.componentDidMount();
      });

      afterAll(() => {
        simple.restore();
      });

      test('calls fetch resource', () => {
        expect(instance.fetchResource.callCount).toBe(1);
        expect(instance.fetchResource.lastCall.args).toEqual([]);
      });
    });
  });

  describe('componentWillUpdate', () => {
    test(
      'sets state view confirmation when next props has reservationCreated',
      () => {
        const instance = getWrapper().instance();
        const nextProps = {
          reservationCreated: Reservation.build(),
        };
        instance.componentWillUpdate(nextProps);
        expect(instance.state.view).toBe('confirmation');
      }
    );

    test(
      'sets state view confirmation when next props has reservationEdited',
      () => {
        const instance = getWrapper().instance();
        const nextProps = {
          reservationCreated: Reservation.build(),
        };
        instance.componentWillUpdate(nextProps);
        expect(instance.state.view).toBe('confirmation');
      }
    );
  });
  describe('componentWillUnmount', () => {
    const clearReservations = simple.mock();
    const closeReservationSuccessModal = simple.mock();
    beforeAll(() => {
      const instance = getWrapper({
        actions: {
          clearReservations,
          closeReservationSuccessModal,
        },
      }).instance();
      instance.componentWillUnmount();
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls clearReservations', () => {
      expect(clearReservations.callCount).toBe(1);
      expect(clearReservations.lastCall.args).toEqual([]);
    });

    test('calls closeReservationSuccessModal', () => {
      expect(closeReservationSuccessModal.callCount).toBe(1);
      expect(closeReservationSuccessModal.lastCall.args).toEqual([]);
    });
  });

  describe('fetchResource', () => {
    const fetchResource = simple.mock();
    beforeAll(() => {
      const instance = getWrapper({
        actions: {
          fetchResource,
        },
      }).instance();
      instance.fetchResource();
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls actions.fetchResource', () => {
      expect(fetchResource.callCount).toBe(1);
      expect(fetchResource.lastCall.args).toHaveLength(2);
      expect(fetchResource.lastCall.args[0]).toEqual(resource.id);
    });
  });

  describe('handleBack', () => {
    test('sets state view time when reservationToEdit no empty', () => {
      const instance = getWrapper({
        reservationToEdit: Reservation.build(),
      }).instance();
      instance.handleBack();
      expect(instance.state.view).toBe('time');
    });
  });

  describe('handleCancel', () => {
    let historyMock;

    beforeAll(() => {
      historyMock = simple.mock(history, 'replace');
    });

    afterAll(() => {
      simple.restore();
    });

    test(
      'calls browserHistory.replace() with /my-reservations when reservationToEdit not empty',
      () => {
        historyMock.reset();
        const expectedPath = '/my-reservations';
        const instance = getWrapper({
          reservationToEdit: Reservation.build(),
        }).instance();
        instance.handleCancel();

        expect(historyMock.callCount).toBe(1);
        expect(historyMock.lastCall.args).toEqual([expectedPath]);
      }
    );

    test(
      'calls history.replace() with /resources when reservationToEdit empty',
      () => {
        historyMock.reset();
        const expectedPath = `/resources/${resource.id}`;
        const instance = getWrapper({
          reservationToEdit: null,
        }).instance();
        instance.handleCancel();

        expect(historyMock.callCount).toBe(1);
        expect(historyMock.lastCall.args).toEqual([expectedPath]);
      }
    );
  });

  describe('handleConfirmTime', () => {
    test('sets state view information when reservationToEdit no empty', () => {
      const instance = getWrapper().instance();
      instance.state.view = 'time';
      instance.handleConfirmTime();
      expect(instance.state.view).toBe('information');
    });
  });

  describe('handleReservation', () => {
    const postReservation = simple.mock();
    const putReservation = simple.mock();
    const values = {
      someField: 'some value',
    };

    test('calls putReservation action when reservationToEdit not empty', () => {
      const reservationToEdit = Reservation.build();
      const instance = getWrapper({
        actions: {
          postReservation,
          putReservation,
        },
        reservationToEdit,
      }).instance();
      instance.handleReservation(values);
      expect(postReservation.callCount).toBe(0);
      expect(putReservation.callCount).toBe(1);
    });

    test('calls postReservation action when reservationToEdit empty', () => {
      postReservation.reset();
      putReservation.reset();
      const instance = getWrapper({
        actions: {
          postReservation,
          putReservation,
        },
      }).instance();
      instance.handleReservation(values);
      expect(postReservation.callCount).toBe(1);
      expect(putReservation.callCount).toBe(0);
    });
  });
});
