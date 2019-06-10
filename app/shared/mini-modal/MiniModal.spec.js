import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import simple from 'simple-mock';

import { shallowWithIntl } from '../../utils/testUtils';
import MiniModal from './MiniModal';

function getWrapper(props) {
  const defaults = {
    buttonContent: 'button text',
    header: 'Modal header',
  };
  return shallowWithIntl(<MiniModal {...defaults} {...props} />);
}

describe('shared/mini-modal/MiniModal', () => {
  test('renders a div.app-MiniModal', () => {
    const wrapper = getWrapper();
    expect(wrapper.is('div.app-MiniModal')).toBe(true);
  });

  describe('show modal button', () => {
    test('is rendered with correct props', () => {
      const wrapper = getWrapper();
      const showButton = wrapper.find('.app-MiniModal__show-button');
      expect(showButton).toHaveLength(1);
      expect(showButton.prop('onClick')).toBe(wrapper.instance().showModal);
    });

    test('has the content given in props', () => {
      const buttonContent = <span>Some text inside a span</span>;
      const showButton = getWrapper({ buttonContent }).find('.app-MiniModal__show-button');
      expect(showButton).toHaveLength(1);
      expect(showButton.prop('children')).toBe(buttonContent);
    });

    test('has correct theme given in the props', () => {
      const theme = 'gold';
      const showButton = getWrapper({ theme }).find('.app-MiniModal__show-button');
      expect(showButton).toHaveLength(1);
      expect(showButton.prop('className')).toContain('app-MiniModal__show-button--theme-gold');
    });
  });

  describe('Modal', () => {
    test('is rendered with correct props', () => {
      const wrapper = getWrapper();
      const modal = wrapper.find(Modal);
      expect(modal).toHaveLength(1);
      expect(modal.prop('onHide')).toBe(wrapper.instance().hideModal);
      expect(modal.prop('show')).toBe(wrapper.instance().state.visible);
    });

    test('has the header given in props', () => {
      const header = 'Some header';
      const modalHeader = getWrapper({ header }).find(Modal).find('h2');
      expect(modalHeader.text()).toBe(header);
    });

    test('has the children given in props as content', () => {
      const children = <span>Some text inside a span</span>;
      const modalContent = getWrapper({ children }).find(Modal).find('.app-MiniModal__modal-content');
      expect(modalContent.prop('children')).toBe(children);
    });

    test('has a button for confirming the modal', () => {
      const wrapper = getWrapper();
      const handleConfirm = wrapper.instance().handleConfirm;
      const modalCloseButton = wrapper.find(Modal).find('button').filter({ onClick: handleConfirm });
      expect(modalCloseButton).toHaveLength(1);
    });

    test('has correct theme given in the props', () => {
      const theme = 'gold';
      const modal = getWrapper({ theme }).find(Modal);
      expect(modal).toHaveLength(1);
      expect(modal.prop('dialogClassName')).toContain('app-MiniModal__modal--theme-gold');
    });
  });

  describe('handleConfirm', () => {
    test('calls onConfirm if given in props', () => {
      const onConfirm = simple.mock();
      const instance = getWrapper({ onConfirm }).instance();
      instance.handleConfirm();
      expect(onConfirm.callCount).toBe(1);
    });

    test('calls hideModal', () => {
      const instance = getWrapper().instance();
      simple.mock(instance, 'hideModal');
      instance.handleConfirm();
      expect(instance.hideModal.callCount).toBe(1);
      simple.restore();
    });
  });

  describe('hideModal', () => {
    test('sets state.visible to false', () => {
      const instance = getWrapper().instance();
      instance.state.visible = true;
      instance.hideModal();
      expect(instance.state.visible).toBe(false);
    });
  });

  describe('showModal', () => {
    test('sets state.visible to true', () => {
      const instance = getWrapper().instance();
      instance.state.visible = false;
      instance.showModal();
      expect(instance.state.visible).toBe(true);
    });
  });
});
