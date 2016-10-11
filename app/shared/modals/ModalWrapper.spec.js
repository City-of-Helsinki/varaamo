import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import simple from 'simple-mock';

import ModalWrapper from './ModalWrapper';

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
      </ModalWrapper>);
  }

  it('renders a Modal component with correct props', () => {
    const modal = getWrapper().find(Modal);

    expect(modal.length).to.equal(1);
    expect(modal.props().className).to.equal(defaultProps.className);
    expect(modal.props().onHide).to.equal(defaultProps.onClose);
    expect(modal.props().show).to.equal(defaultProps.show);
  });

  it('renders ModalHeader component with closeButton', () => {
    const modalHeader = getWrapper().find(Modal.Header);

    expect(modalHeader.length).to.equal(1);
    expect(modalHeader.props().closeButton).to.equal(true);
  });

  it('renders ModalTitle component with correct title', () => {
    const modalTitle = getWrapper().find(Modal.Title);

    expect(modalTitle.length).to.equal(1);
    expect(modalTitle.props().children).to.equal(defaultProps.title);
  });

  it('renders ModalBody component', () => {
    const modalBody = getWrapper().find(Modal.Body);

    expect(modalBody.length).to.equal(1);
  });

  it('renders content of the modal inside ModalBody', () => {
    const modalBody = getWrapper().find(Modal.Body);
    const expectedContent = <p>Modal content</p>;

    expect(modalBody.children().equals(expectedContent)).to.be.true;
  });

  it('renders ModalFooter component', () => {
    const modalFooter = getWrapper().find(Modal.Footer);

    expect(modalFooter.length).to.equal(1);
  });

  describe('footerContent', () => {
    it('is rendered inside ModalFooter if footerContent is given in props', () => {
      const modalFooter = getWrapper().find(Modal.Footer);

      expect(modalFooter.children().equals(defaultProps.footerContent)).to.be.true;
    });

    it('is not rendered if footerContent is not given in props', () => {
      const footerContent = undefined;
      const modalFooter = getWrapper({ footerContent }).find(Modal.Footer);

      expect(modalFooter.length).to.equal(0);
    });
  });
});
