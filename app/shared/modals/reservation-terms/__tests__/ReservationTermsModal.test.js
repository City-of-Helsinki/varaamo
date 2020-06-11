import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import simple from 'simple-mock';

import WrappedText from '../../../wrapped-text/WrappedText';
import Resource from '../../../../utils/fixtures/Resource';
import { shallowWithIntl } from '../../../../utils/testUtils';
import { UnconnectedReservationTermsModal as ReservationTermsModal } from '../ReservationTermsModal';

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
    return shallowWithIntl(
      <ReservationTermsModal {...defaultProps} {...extraProps} />
    );
  }

  describe('render', () => {
    test('renders a Modal component', () => {
      const modalComponent = getWrapper().find(Modal);
      expect(modalComponent.length).toBe(1);
    });

    describe('Modal header', () => {
      function getModalHeaderWrapper(props) {
        return getWrapper(props).find(Modal.Header);
      }

      test('is rendered', () => {
        expect(getModalHeaderWrapper()).toHaveLength(1);
      });

      test('contains a close button', () => {
        expect(getModalHeaderWrapper().props().closeButton).toBe(true);
      });

      test('contains title', () => {
        const modalTitle = getModalHeaderWrapper().find(Modal.Title);
        expect(modalTitle.length).toBe(1);
        expect(modalTitle.prop('children')).toBe(
          'ReservationTermsModal.resourceTermsTitle'
        );
      });
    });

    describe('Modal body', () => {
      function getModalBodyWrapper(props) {
        return getWrapper(props).find(Modal.Body);
      }

      test('is rendered', () => {
        expect(getModalBodyWrapper()).toHaveLength(1);
      });

      test('renders resource name', () => {
        const texts = getModalBodyWrapper().find('span');
        expect(texts).toHaveLength(2);
        expect(texts.at(0).text()).toContain(
          'ReservationTermsModal.resourceTermsSubTitle'
        );
      });

      test('renders generic terms', () => {
        const resourceWithTerms = Resource.build({
          genericTerms: 'some generic terms',
        });
        const wrappedText = getModalBodyWrapper({
          resource: resourceWithTerms,
        }).find(WrappedText);
        expect(wrappedText).toHaveLength(1);
        expect(wrappedText.prop('text')).toBe(resourceWithTerms.genericTerms);
      });
    });

    describe('Modal Footer', () => {
      function getModalFooterWrapper(props) {
        return getWrapper(props).find(Modal.Footer);
      }

      test('is rendered', () => {
        expect(getModalFooterWrapper).toHaveLength(1);
      });

      test('renders button', () => {
        const closeResourceTermsModal = simple.mock();
        const actions = { closeResourceTermsModal };
        const button = getModalFooterWrapper({ actions }).find(Button);
        expect(button).toHaveLength(1);
        expect(button.prop('onClick')).toBe(closeResourceTermsModal);
      });
    });
  });
});
