import range from 'lodash/range';
import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';
import Overlay from 'react-bootstrap/lib/Overlay';
import FontAwesome from 'react-fontawesome';

import { injectT } from 'i18n';
import SearchControlOverlay from './SearchControlOverlay';

class PeopleCapacityControl extends React.Component {
  static propTypes = {
    onConfirm: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    value: PropTypes.number,
  };

  state = {
    visible: false,
  }

  getOption(value) {
    return { label: String(value), value };
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
    const { t, value } = this.props;
    const options = range(1, 10).map(this.getOption);
    range(10, 30, 5).forEach(index => options.push(this.getOption(index)));
    options.push({ label: '30+', value: 30 });
    const listItems = options.map(option =>
      <ListGroupItem key={option.value} onClick={() => this.handleConfirm(option.value)}>
        {option.label}
      </ListGroupItem>
    );

    return (
      <div className="app-PeopleCapacityControl">
        <Button
          className="app-PeopleCapacityControl__show-button"
          onClick={this.showOverlay}
        >
          <div><FontAwesome name="users" /> {t('PeopleCapacityControl.buttonLabel')}</div>
          <div>{value || '1'}</div>
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
            title={t('PeopleCapacityControl.header')}
          >
            <ListGroup>
              {listItems}
            </ListGroup>
          </SearchControlOverlay>
        </Overlay>
      </div>
    );
  }
}

export default injectT(PeopleCapacityControl);
