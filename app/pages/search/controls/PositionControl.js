import React, { PropTypes } from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import InputGroup from 'react-bootstrap/lib/InputGroup';
import Overlay from 'react-bootstrap/lib/Overlay';
import Toggle from 'react-toggle';
import { createSliderWithTooltip } from 'rc-slider';
import Slider from 'rc-slider/lib/Slider';

import { injectT } from 'i18n';
import SearchControlOverlay from './SearchControlOverlay';

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

  hideOverlay = () => {
    this.setState({ visible: false });
  }

  showOverlay = () => {
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
    this.hideOverlay();
  }

  distanceFormatter = value => (
    value > this.state.maxDistance ?
    this.props.t('PositionControl.noDistanceLimit') :
    `${value / 1000} km`
  );

  render() {
    const { t, geolocated } = this.props;
    const value = this.props.geolocated ?
      this.distanceFormatter(this.state.distance) :
      t('common.select');

    return (
      <div className="app-PositionControl">
        <ControlLabel>{t('PositionControl.buttonLabel')}</ControlLabel>
        <FormGroup onClick={this.showOverlay}>
          <InputGroup>
            <FormControl disabled type="text" value={value} />
            <InputGroup.Addon>
              <Glyphicon glyph="triangle-bottom" />
            </InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        <Overlay
          container={this}
          onHide={this.hideOverlay}
          placement="bottom"
          rootClose
          show={this.state.visible}
        >
          <SearchControlOverlay
            onHide={this.hideOverlay}
            title={t('PositionControl.header')}
          >
            <div className="app-PositionControl__content">
              <div className="app-PositionControl__toggle-content">
                <label htmlFor="geolocation-status">
                  <span>{t('PositionControl.useDistance')}</span>
                  <Toggle
                    className="app-PositionControl__geolocation-toggle"
                    defaultChecked={geolocated}
                    id="geolocation-status"
                    onChange={this.handleToggleChange}
                  />
                </label>
              </div>
              <div>
                {t('PositionControl.maxDistance')}: {this.distanceFormatter(this.state.distance)}
              </div>
              <TooltipSlider
                className="app-PositionControl__distance_slider"
                disabled={!this.state.toggled}
                max={this.state.maxDistance + this.state.step}
                min={this.state.step}
                onAfterChange={this.handleConfirm}
                onChange={this.handleDistanceSliderChange}
                step={this.state.step}
                tipFormatter={this.distanceFormatter}
                tipProps={{ overlayClassName: 'app-PositionControl__distance_slider_tooltip' }}
                value={this.state.distance}
              />
            </div>
          </SearchControlOverlay>
        </Overlay>
      </div>
    );
  }
}

export default injectT(PositionControl);
