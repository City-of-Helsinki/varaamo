import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';

import { injectT } from 'i18n';

class MiniModal extends React.Component {
  static propTypes = {
    buttonContent: PropTypes.node.isRequired,
    children: PropTypes.node,
    header: PropTypes.string.isRequired,
    onConfirm: PropTypes.func,
    t: PropTypes.func.isRequired,
    theme: PropTypes.string,
  }

  static defaultProps = {
    theme: 'gray',
  }

  state = {
    visible: false,
  }

  handleConfirm = () => {
    const { onConfirm } = this.props;
    onConfirm && onConfirm();
    this.hideModal();
  }

  hideModal = () => {
    this.setState({ visible: false });
  }

  showModal = () => {
    this.setState({ visible: true });
  }

  render() {
    const { buttonContent, children, header, t, theme } = this.props;
    return (
      <div className={`app-MiniModal app-MiniModal--theme-${theme}`}>
        <Button
          className={`app-MiniModal__show-button app-MiniModal__show-button--theme-${theme}`}
          onClick={this.showModal}
        >
          {buttonContent}
        </Button>
        <Modal
          dialogClassName={`app-MiniModal__modal app-MiniModal__modal--theme-${theme}`}
          onHide={this.hideModal}
          show={this.state.visible}
        >
          <div className="app-MiniModal__modal-header">
            <h2>{header}</h2>
          </div>
          <div className="app-MiniModal__modal-content">
            {children}
          </div>
          <div className="app-MiniModal__modal-footer">
            <button
              className="app-MiniModal__modal-footer-close-button"
              onClick={this.handleConfirm}
            >
              {t('MiniModal.buttonText')}
            </button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default injectT(MiniModal);
