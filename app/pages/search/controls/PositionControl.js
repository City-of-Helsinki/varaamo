import React, { PropTypes } from 'react';
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
    };
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
  }

  distanceFormatter = value => (
    value > this.state.maxDistance ?
    this.props.t('PositionControl.noDistanceLimit') :
    `${value / 1000} km`
  );

  render() {
    const { t, geolocated } = this.props;
    return (
      <div className="app-PositionControl">
        <Toggle
          className="app-PositionControl__geolocation-toggle"
          defaultChecked={geolocated}
          id="geolocation-status"
          onChange={this.handleToggleChange}
        />
        <label className="app-PositionControl__label" htmlFor="geolocation-status">
          {t('PositionControl.useDistance')}
        </label>
        {this.state.toggled &&
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
        }
        {this.state.toggled &&
          <div>
            {t('PositionControl.maxDistance')}: {this.distanceFormatter(this.state.distance)}
          </div>
        }
      </div>
    );
  }
}

export default injectT(PositionControl);
