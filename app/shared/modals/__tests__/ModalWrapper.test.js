import { shallow } from 'enzyme';
import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import simple from 'simple-mock';

import ModalWrapper from '../ModalWrapper';

describe('shared/modals/ModalWrapper', () => {
  const defaultProps = {
    className: 'modal-class',
    footerContent: <div>Footer content</div>,
    onClose: simple.mock(),
    show: true,
    title: 'Modal title',
  };

  function getWrapper(extraProps) {
    return shallow(
      <ModalWrapper {...defaultProps} {...extraProps}>
        <p>Modal content</p>
      </ModalWrapper>,
    );
  }

  test('renders a Modal component with correct props', () => {
    const modal = getWrapper().find(Modal);

    expect(modal.length).toBe(1);
    expect(modal.props().className).toBe(defaultProps.className);
    expect(modal.props().onHide).toBe(defaultProps.onClose);
    expect(modal.props().show).toBe(defaultProps.show);
  });

  test('renders ModalHeader component with closeButton', () => {
    const modalHeader = getWrapper().find(Modal.Header);

    expect(modalHeader.length).toBe(1);
    expect(modalHeader.props().closeButton).toBe(true);
  });

  test('renders ModalTitle component with correct title', () => {
    const modalTitle = getWrapper().find(Modal.Title);

    expect(modalTitle.length).toBe(1);
    expect(modalTitle.props().children).toBe(defaultProps.title);
  });

  test('renders ModalBody component', () => {
    const modalBody = getWrapper().find(Modal.Body);

    expect(modalBody.length).toBe(1);
  });

  test('renders content of the modal inside ModalBody', () => {
    const modalBody = getWrapper().find(Modal.Body);
    const expectedContent = <p>Modal content</p>;

    expect(modalBody.children().equals(expectedContent)).toBe(true);
  });

  test('renders ModalFooter component', () => {
    const modalFooter = getWrapper().find(Modal.Footer);

    expect(modalFooter.length).toBe(1);
  });

  describe('footerContent', () => {
    test(
      'is rendered inside ModalFooter if footerContent is given in props',
      () => {
        const modalFooter = getWrapper().find(Modal.Footer);

        expect(modalFooter.children().equals(defaultProps.footerContent)).toBe(true);
      },
    );

    test('is not rendered if footerContent is not given in props', () => {
      const footerContent = undefined;
      const modalFooter = getWrapper({ footerContent }).find(Modal.Footer);

      expect(modalFooter.length).toBe(0);
    });
  });
});
