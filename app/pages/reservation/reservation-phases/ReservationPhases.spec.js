import { expect } from 'chai';
import React from 'react';

import { shallowWithIntl } from 'utils/testUtils';
import ReservationPhases from './ReservationPhases';
import ReservationPhase from './ReservationPhase';

describe('pages/reservation/reservation-phases/ReservationPhases', () => {
  const defaultProps = {
    currentPhase: 'information',
    isEditing: false,
  };

  function getWrapper(extraProps) {
    return shallowWithIntl(<ReservationPhases {...defaultProps} {...extraProps} />);
  }

  describe('when currentPhase is information', () => {
    it('renders two phases with correct props when isEditing false', () => {
      const phases = getWrapper({
        currentPhase: 'information',
        isEditing: false,
      }).find(ReservationPhase);

      expect(phases).to.have.length(2);
      expect(phases.at(0).prop('cols')).to.equal(6);
      expect(phases.at(0).prop('index')).to.equal(1);
      expect(phases.at(0).prop('isActive')).to.be.true;
      expect(phases.at(0).prop('isCompleted')).to.be.false;
      expect(phases.at(0).prop('title')).to.equal('ReservationPhase.informationTitle');
      expect(phases.at(1).prop('cols')).to.equal(6);
      expect(phases.at(1).prop('index')).to.equal(2);
      expect(phases.at(1).prop('isActive')).to.be.false;
      expect(phases.at(1).prop('isCompleted')).to.be.false;
      expect(phases.at(1).prop('title')).to.equal('ReservationPhase.confirmationTitle');
    });

    it('renders three phases with correct props when isEditing true', () => {
      const phases = getWrapper({
        currentPhase: 'information',
        isEditing: true,
      }).find(ReservationPhase);

      expect(phases).to.have.length(3);
      expect(phases.at(0).prop('cols')).to.equal(4);
      expect(phases.at(0).prop('index')).to.equal(1);
      expect(phases.at(0).prop('isActive')).to.be.false;
      expect(phases.at(0).prop('isCompleted')).to.be.true;
      expect(phases.at(0).prop('title')).to.equal('ReservationPhase.timeTitle');
      expect(phases.at(1).prop('cols')).to.equal(4);
      expect(phases.at(1).prop('index')).to.equal(2);
      expect(phases.at(1).prop('isActive')).to.be.true;
      expect(phases.at(1).prop('isCompleted')).to.be.false;
      expect(phases.at(1).prop('title')).to.equal('ReservationPhase.informationTitle');
      expect(phases.at(2).prop('cols')).to.equal(4);
      expect(phases.at(2).prop('index')).to.equal(3);
      expect(phases.at(2).prop('isActive')).to.be.false;
      expect(phases.at(2).prop('isCompleted')).to.be.false;
      expect(phases.at(2).prop('title')).to.equal('ReservationPhase.confirmationTitle');
    });
  });

  describe('when currentPhase is confirmation', () => {
    it('renders two phases with correct props when isEditing false', () => {
      const phases = getWrapper({
        currentPhase: 'confirmation',
        isEditing: false,
      }).find(ReservationPhase);

      expect(phases).to.have.length(2);
      expect(phases.at(0).prop('cols')).to.equal(6);
      expect(phases.at(0).prop('index')).to.equal(1);
      expect(phases.at(0).prop('isActive')).to.be.false;
      expect(phases.at(0).prop('isCompleted')).to.be.true;
      expect(phases.at(0).prop('title')).to.equal('ReservationPhase.informationTitle');
      expect(phases.at(1).prop('cols')).to.equal(6);
      expect(phases.at(1).prop('index')).to.equal(2);
      expect(phases.at(1).prop('isActive')).to.be.true;
      expect(phases.at(1).prop('isCompleted')).to.be.false;
      expect(phases.at(1).prop('title')).to.equal('ReservationPhase.confirmationTitle');
    });

    it('renders three phases with correct props when isEditing true', () => {
      const phases = getWrapper({
        currentPhase: 'confirmation',
        isEditing: true,
      }).find(ReservationPhase);

      expect(phases).to.have.length(3);
      expect(phases.at(0).prop('cols')).to.equal(4);
      expect(phases.at(0).prop('index')).to.equal(1);
      expect(phases.at(0).prop('isActive')).to.be.false;
      expect(phases.at(0).prop('isCompleted')).to.be.true;
      expect(phases.at(0).prop('title')).to.equal('ReservationPhase.timeTitle');
      expect(phases.at(1).prop('cols')).to.equal(4);
      expect(phases.at(1).prop('index')).to.equal(2);
      expect(phases.at(1).prop('isActive')).to.be.false;
      expect(phases.at(1).prop('isCompleted')).to.be.true;
      expect(phases.at(1).prop('title')).to.equal('ReservationPhase.informationTitle');
      expect(phases.at(2).prop('cols')).to.equal(4);
      expect(phases.at(2).prop('index')).to.equal(3);
      expect(phases.at(2).prop('isActive')).to.be.true;
      expect(phases.at(2).prop('isCompleted')).to.be.false;
      expect(phases.at(2).prop('title')).to.equal('ReservationPhase.confirmationTitle');
    });
  });
});
