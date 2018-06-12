import { expect } from 'chai';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import simple from 'simple-mock';

import WrappedText from 'shared/wrapped-text';
import Resource from 'utils/fixtures/Resource';
import { shallowWithIntl } from 'utils/testUtils';
import {
  UnconnectedReservationTermsModal as ReservationTermsModal,
} from './ReservationTermsModal';

describe('shared/modals/reservation-cancel/ReservationTermsModal', () => {
  const resource = Resource.build();
  const defaultProps = {
    actions: {
      closeResourceTermsModal: () => null,
    },
    resource,
    show: true,
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<ReservationTermsModal {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    it('renders a Modal component', () => {
      const modalComponent = getWrapper().find(Modal);
      expect(modalComponent.length).to.equal(1);
    });

    describe('Modal header', () => {
      function getModalHeaderWrapper(props) {
        return getWrapper(props).find(Modal.Header);
      }

      it('is rendered', () => {
        expect(getModalHeaderWrapper()).to.have.length(1);
      });

      it('contains a close button', () => {
        expect(getModalHeaderWrapper().props().closeButton).to.equal(true);
      });

      it('contains title', () => {
        const modalTitle = getModalHeaderWrapper().find(Modal.Title);
        expect(modalTitle.length).to.equal(1);
        expect(modalTitle.prop('children')).to.equal('ReservationTermsModal.resourceTermsTitle');
      });
    });

    describe('Modal body', () => {
      function getModalBodyWrapper(props) {
        return getWrapper(props).find(Modal.Body);
      }

      it('is rendered', () => {
        expect(getModalBodyWrapper()).to.have.length(1);
      });

      it('renders resource name', () => {
        const texts = getModalBodyWrapper().find('span');
        expect(texts).to.have.length(2);
        expect(texts.at(0).text()).to.contain('ReservationTermsModal.resourceTermsSubTitle');
      });

      it('renders generic terms', () => {
        const resourceWithTerms = Resource.build({
          genericTerms: 'some generic terms',
        });
        const wrappedText = getModalBodyWrapper({ resource: resourceWithTerms }).find(WrappedText);
        expect(wrappedText).to.have.length(1);
        expect(wrappedText.prop('text')).to.equal(resourceWithTerms.genericTerms);
      });
    });

    describe('Modal Footer', () => {
      function getModalFooterWrapper(props) {
        return getWrapper(props).find(Modal.Footer);
      }

      it('is rendered', () => {
        expect(getModalFooterWrapper).to.have.length(1);
      });

      it('renders button', () => {
        const closeResourceTermsModal = simple.mock();
        const actions = { closeResourceTermsModal };
        const button = getModalFooterWrapper({ actions }).find(Button);
        expect(button).to.have.length(1);
        expect(button.prop('onClick')).to.equal(closeResourceTermsModal);
      });
    });
  });
});
