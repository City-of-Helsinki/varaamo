import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Overlay from 'react-bootstrap/lib/Overlay';
import FontAwesome from 'react-fontawesome';

import { injectT } from 'i18n';
import SearchControlOverlay from './SearchControlOverlay';

class PurposeControl extends React.Component {
  static propTypes = {
    isLoading: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    purposeOptions: PropTypes.array.isRequired,
    t: PropTypes.func.isRequired,
    value: PropTypes.string,
  }

  state = {
    visible: false,
  }

  hideOverlay = () => {
    this.setState({ visible: false });
  }

  showOverlay = () => {
    this.setState({ visible: true });
  }

  handleConfirm = (value) => {
    this.props.onConfirm(value);
    this.hideOverlay();
  }

  render() {
    const { isLoading, purposeOptions, t, value } = this.props;
    const selectOptions = [
      {
        label: t('common.optionsAllLabel'),
        value: '',
      },
      ...purposeOptions,
    ];
    const originalOption = selectOptions.find(option => option.value === value) || {};
    const listItems = selectOptions.map(option =>
      <ListGroupItem key={option.value} onClick={() => this.handleConfirm(option.value)}>
        {option.label}
      </ListGroupItem>
    );

    return (
      <div className="app-PurposeControl">
        <Button
          className="app-PurposeControl__show-button"
          onClick={this.showOverlay}
        >
          <div><FontAwesome name="bullseye" /> {t('PurposeControl.buttonLabel')}</div>
          <div>{originalOption.label}</div>
        </Button>
        <Overlay
          container={this}
          onHide={this.hideOverlay}
          placement="bottom"
          rootClose
          show={this.state.visible}
        >
          <SearchControlOverlay
            onHide={this.hideOverlay}
            title={t('PurposeControl.label')}
          >
            <ListGroup>
              {!isLoading && listItems}
            </ListGroup>
          </SearchControlOverlay>
        </Overlay>
      </div>
    );
  }
}

export default injectT(PurposeControl);
