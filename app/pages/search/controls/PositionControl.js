import classnames from 'classnames';
import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Modal from 'react-bootstrap/lib/Modal';
import Toggle from 'react-toggle';
import { createSliderWithTooltip } from 'rc-slider';
import Slider from 'rc-slider/lib/Slider';

import { injectT } from 'i18n';

const TooltipSlider = createSliderWithTooltip(Slider);

class PositionControl extends React.Component {
  static propTypes = {
    geolocated: PropTypes.bool,
    onConfirm: PropTypes.func.isRequired,
    onPositionSwitch: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    value: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      distance: this.props.value || 21000,
      maxDistance: 20000,
      step: 1000,
      toggled: this.props.geolocated,
      visible: false,
    };
  }

  getOption(value) {
    return { label: String(value), value };
  }

  hideModal = () => {
    this.setState({ visible: false });
  }

  showModal = () => {
    this.setState({ visible: true });
  }

  handleToggleChange = (e) => {
    this.setState({ toggled: e.target.checked });
    this.props.onPositionSwitch(e);
  }

  handleDistanceSliderChange = (value) => {
    this.setState({ distance: value });
  }

  handleConfirm = (value) => {
    if (value > this.state.maxDistance) {
      this.props.onConfirm('');
    } else {
      this.props.onConfirm(value);
    }
    this.hideModal();
  }

  tipFormatter = value => (
    value > this.state.maxDistance ?
    this.props.t('PositionControl.noDistanceLimit') :
    `${value / 1000} Km`
  );

  render() {
    const { t, geolocated } = this.props;
    return (
      <div className="app-PositionControl">
        <Button
          className={classnames('app-PositionControl__show-button', {
            'app-PositionControl__active': geolocated,
          })}
          onClick={this.showModal}
        >
          <Glyphicon glyph="map-marker" />
        </Button>
        <Modal
          dialogClassName="app-PositionControl__modal"
          onHide={this.hideModal}
          show={this.state.visible}
        >
          <div className="app-PositionControl__modal-header">
            <h2>
              <label htmlFor="geolocation-status">
                <span>{t('PositionControl.header')}</span>
                <Toggle
                  className="app-PositionControl__geolocation-toggle"
                  defaultChecked={geolocated}
                  id="geolocation-status"
                  onChange={this.handleToggleChange}
                />
              </label>
            </h2>
          </div>
          <div className="app-PositionControl__modal-content">
            <TooltipSlider
              className="app-PositionControl__distance_slider"
              disabled={!this.state.toggled}
              max={this.state.maxDistance + this.state.step}
              min={this.state.step}
              onAfterChange={this.handleConfirm}
              onChange={this.handleDistanceSliderChange}
              step={this.state.step}
              tipFormatter={this.tipFormatter}
              tipProps={{ overlayClassName: 'app-PositionControl__distance_slider_tooltip' }}
              value={this.state.distance}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default injectT(PositionControl);
