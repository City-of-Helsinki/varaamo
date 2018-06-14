import { expect } from 'chai';
import React from 'react';
import Loader from 'react-loader';
import { browserHistory } from 'react-router';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import PageWrapper from 'pages/PageWrapper';
import { shallowWithIntl } from 'utils/testUtils';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import User from 'utils/fixtures/User';
import ReservationConfirmation from './reservation-confirmation/ReservationConfirmation';
import ReservationInformation from './reservation-information/ReservationInformation';
import ReservationPhases from './reservation-phases/ReservationPhases';
import ReservationTime from './reservation-time/ReservationTime';
import { UnconnectedReservationPage as ReservationPage } from './ReservationPage';

describe('pages/reservation/ReservationPage', () => {
  const resource = Immutable(Resource.build());
  const defaultProps = {
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
    params: {},
    reservationToEdit: null,
    reservationCreated: null,
    reservationEdited: null,
    resource,
    selected: [{
      begin: '2016-10-10T10:00:00+03:00',
      end: '2016-10-10T11:00:00+03:00',
      resource: resource.id,
    }, {
      begin: '2016-10-10T11:00:00+03:00',
      end: '2016-10-10T12:00:00+03:00',
      resource: resource.id,
    }],
    unit: Immutable(Unit.build()),
    user: Immutable(User.build()),
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationPage {...defaultProps} {...extraProps} />);
  }

  describe('PageWrapper title', () => {
    it('renders new reservation title when reservationToEdit and reservationEdited is empty', () => {
      const pageWrapper = getWrapper({
        reservationToEdit: null,
        reservationEdited: null,
      }).find(PageWrapper);

      expect(pageWrapper).to.have.length(1);
      expect(pageWrapper.prop('title')).to.equal('ReservationPage.newReservationTitle');
    });

    it('renders edit reservation title when reservationToEdit not empty', () => {
      const pageWrapper = getWrapper({
        reservationToEdit: Reservation.build(),
      }).find(PageWrapper);

      expect(pageWrapper).to.have.length(1);
      expect(pageWrapper.prop('title')).to.equal('ReservationPage.editReservationTitle');
    });

    it('renders edit reservation title when reservationEdited not empty', () => {
      const pageWrapper = getWrapper({
        reservationEdited: Reservation.build(),
      }).find(PageWrapper);

      expect(pageWrapper).to.have.length(1);
      expect(pageWrapper.prop('title')).to.equal('ReservationPage.editReservationTitle');
    });
  });

  describe('Loader', () => {
    it('prop loaded true when resource not empty', () => {
      const loader = getWrapper({
        resource,
      }).find(Loader);

      expect(loader).to.have.length(1);
      expect(loader.prop('loaded')).to.be.true;
    });

    it('not rendered when resource empty', () => {
      const loader = getWrapper({
        resource: {},
      }).find(Loader);

      expect(loader).to.have.length(0);
    });
  });

  describe('ReservationPhases', () => {
    it('renders correct props when reservationToEdit null', () => {
      const reservationPhases = getWrapper({
        reservationToEdit: null,
      }).find(ReservationPhases);
      expect(reservationPhases).to.have.length(1);
      expect(reservationPhases.prop('currentPhase')).to.equal('information');
      expect(reservationPhases.prop('isEditing')).to.be.false;
    });

    it('renders correct props when reservationToEdit not null', () => {
      const reservationPhases = getWrapper({
        reservationToEdit: Reservation.build(),
      }).find(ReservationPhases);
      expect(reservationPhases).to.have.length(1);
      expect(reservationPhases.prop('currentPhase')).to.equal('time');
      expect(reservationPhases.prop('isEditing')).to.be.true;
    });
  });

  describe('ReservationTime', () => {
    it('renders ReservationTime when reservationToEdit not empty', () => {
      const reservationTime = getWrapper({
        reservationToEdit: Reservation.build(),
      }).find(ReservationTime);
      expect(reservationTime).to.have.length(1);
    });

    it('does not render ReservationTime when reservationToEdit is empty', () => {
      const reservationTime = getWrapper({
        reservationToEdit: null,
      }).find(ReservationTime);
      expect(reservationTime).to.have.length(0);
    });
  });

  describe('ReservationInformation', () => {
    it('renders ReservationInformation when view is information and selected not empty', () => {
      const reservationInformation = getWrapper().find(ReservationInformation);
      expect(reservationInformation).to.have.length(1);
    });

    it('does not render ReservationInformation by default when reservationToEdit is not empty', () => {
      const reservationInformation = getWrapper({
        reservationToEdit: Reservation.build(),
      }).find(ReservationInformation);
      expect(reservationInformation).to.have.length(0);
    });
  });

  describe('ReservationConfirmation', () => {
    it('does not render ReservationInformation by default', () => {
      const reservationConfirmation = getWrapper().find(ReservationConfirmation);
      expect(reservationConfirmation).to.have.length(0);
    });
  });

  describe('constructor', () => {
    it('state view is time when prop reservationToEdit not empty', () => {
      const instance = getWrapper({
        reservationToEdit: Reservation.build(),
      }).instance();
      expect(instance.state.view).to.equal('time');
    });

    it('state view is information when prop reservationToEdit empty', () => {
      const instance = getWrapper({
        reservationToEdit: null,
      }).instance();
      expect(instance.state.view).to.equal('information');
    });
  });

  describe('componentDidMount', () => {
    describe('when reservations and selected empty', () => {
      let browserHistoryMock;

      before(() => {
        browserHistoryMock = simple.mock(browserHistory, 'replace');
        const instance = getWrapper({
          reservationCreated: null,
          reservationEdited: null,
          reservationToEdit: null,
          selected: [],
        }).instance();
        instance.componentDidMount();
      });

      after(() => {
        simple.restore();
      });

      it('calls browserHistory.replace() with /my-reservations', () => {
        const expectedPath = '/my-reservations';
        expect(browserHistoryMock.callCount).to.equal(1);
        expect(browserHistoryMock.lastCall.args).to.deep.equal([expectedPath]);
      });
    });

    describe('when reservations and selected empty and location query has resource', () => {
      let browserHistoryMock;

      before(() => {
        browserHistoryMock = simple.mock(browserHistory, 'replace');
        const instance = getWrapper({
          location: {
            query: {
              resource: resource.id,
            },
          },
          reservationCreated: null,
          reservationEdited: null,
          reservationToEdit: null,
          selected: [],
        }).instance();
        instance.componentDidMount();
      });

      after(() => {
        simple.restore();
      });

      it('calls browserHistory.replace() with /my-reservations', () => {
        const expectedPath = `/resources/${resource.id}`;
        expect(browserHistoryMock.callCount).to.equal(1);
        expect(browserHistoryMock.lastCall.args).to.deep.equal([expectedPath]);
      });
    });

    describe('when selected not empty', () => {
      let instance;
      before(() => {
        instance = getWrapper({
          selected: defaultProps.selected,
        }).instance();
        instance.fetchResource = simple.mock();
        instance.componentDidMount();
      });

      after(() => {
        simple.restore();
      });

      it('calls fetch resource', () => {
        expect(instance.fetchResource.callCount).to.equal(1);
        expect(instance.fetchResource.lastCall.args).to.deep.equal([]);
      });
    });
  });

  describe('componentWillUpdate', () => {
    it('sets state view confirmation when next props has reservationCreated', () => {
      const instance = getWrapper().instance();
      const nextProps = {
        reservationCreated: Reservation.build(),
      };
      instance.componentWillUpdate(nextProps);
      expect(instance.state.view).to.equal('confirmation');
    });

    it('sets state view confirmation when next props has reservationEdited', () => {
      const instance = getWrapper().instance();
      const nextProps = {
        reservationCreated: Reservation.build(),
      };
      instance.componentWillUpdate(nextProps);
      expect(instance.state.view).to.equal('confirmation');
    });
  });
  describe('componentWillUnmount', () => {
    const clearReservations = simple.mock();
    const closeReservationSuccessModal = simple.mock();
    before(() => {
      const instance = getWrapper({
        actions: {
          clearReservations,
          closeReservationSuccessModal,
        },
      }).instance();
      instance.componentWillUnmount();
    });

    after(() => {
      simple.restore();
    });

    it('calls clearReservations', () => {
      expect(clearReservations.callCount).to.equal(1);
      expect(clearReservations.lastCall.args).to.deep.equal([]);
    });

    it('calls closeReservationSuccessModal', () => {
      expect(closeReservationSuccessModal.callCount).to.equal(1);
      expect(closeReservationSuccessModal.lastCall.args).to.deep.equal([]);
    });
  });

  describe('fetchResource', () => {
    const fetchResource = simple.mock();
    before(() => {
      const instance = getWrapper({
        actions: {
          fetchResource,
        },
      }).instance();
      instance.fetchResource();
    });

    after(() => {
      simple.restore();
    });

    it('calls actions.fetchResource', () => {
      expect(fetchResource.callCount).to.equal(1);
      expect(fetchResource.lastCall.args).to.have.length(2);
      expect(fetchResource.lastCall.args[0]).to.deep.equal(resource.id);
    });
  });

  describe('handleBack', () => {
    it('sets state view time when reservationToEdit no empty', () => {
      const instance = getWrapper({
        reservationToEdit: Reservation.build(),
      }).instance();
      instance.handleBack();
      expect(instance.state.view).to.equal('time');
    });
  });

  describe('handleCancel', () => {
    let browserHistoryMock;

    before(() => {
      browserHistoryMock = simple.mock(browserHistory, 'replace');
    });

    after(() => {
      simple.restore();
    });

    it('calls browserHistory.replace() with /my-reservations when reservationToEdit not empty', () => {
      browserHistoryMock.reset();
      const expectedPath = '/my-reservations';
      const instance = getWrapper({
        reservationToEdit: Reservation.build(),
      }).instance();
      instance.handleCancel();

      expect(browserHistoryMock.callCount).to.equal(1);
      expect(browserHistoryMock.lastCall.args).to.deep.equal([expectedPath]);
    });

    it('calls browserHistory.replace() with /resources when reservationToEdit empty', () => {
      browserHistoryMock.reset();
      const expectedPath = `/resources/${resource.id}`;
      const instance = getWrapper({
        reservationToEdit: null,
      }).instance();
      instance.handleCancel();

      expect(browserHistoryMock.callCount).to.equal(1);
      expect(browserHistoryMock.lastCall.args).to.deep.equal([expectedPath]);
    });
  });

  describe('handleConfirmTime', () => {
    it('sets state view information when reservationToEdit no empty', () => {
      const instance = getWrapper().instance();
      instance.state.view = 'time';
      instance.handleConfirmTime();
      expect(instance.state.view).to.equal('information');
    });
  });

  describe('handleReservation', () => {
    const postReservation = simple.mock();
    const putReservation = simple.mock();
    const values = {
      someField: 'some value',
    };

    it('calls putReservation action when reservationToEdit not empty', () => {
      const reservationToEdit = Reservation.build();
      const instance = getWrapper({
        actions: {
          postReservation,
          putReservation,
        },
        reservationToEdit,
      }).instance();
      instance.handleReservation(values);
      expect(postReservation.callCount).to.equal(0);
      expect(putReservation.callCount).to.equal(1);
    });

    it('calls postReservation action when reservationToEdit empty', () => {
      postReservation.reset();
      putReservation.reset();
      const instance = getWrapper({
        actions: {
          postReservation,
          putReservation,
        },
      }).instance();
      instance.handleReservation(values);
      expect(postReservation.callCount).to.equal(1);
      expect(putReservation.callCount).to.equal(0);
    });
  });
});
