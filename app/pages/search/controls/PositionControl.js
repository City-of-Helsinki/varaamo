import React from 'react';
import PropTypes from 'prop-types';
import { createSliderWithTooltip } from 'rc-slider';
import Slider from 'rc-slider/lib/Slider';
import { injectT } from 'i18n';

import CheckboxControl from './CheckboxControl';

const TooltipSlider = createSliderWithTooltip(Slider);

class PositionControl extends React.Component {
  static propTypes = {
    geolocated: PropTypes.bool,
    onConfirm: PropTypes.func.isRequired,
    onPositionSwitch: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    value: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      distance: this.props.value || 21000,
      maxDistance: 20000,
      step: 1000,
      toggled: this.props.geolocated
    };
  }

  handleToggleChange = (value) => {
    this.setState({ toggled: value });
    this.props.onPositionSwitch();
  };

  handleDistanceSliderChange = (value) => {
    this.setState({ distance: value });
  };

  handleConfirm = (value) => {
    if (value > this.state.maxDistance) {
      this.props.onConfirm('');
    } else {
      this.props.onConfirm(value);
    }
  };

  distanceFormatter = (value) => {
    if (value > this.state.maxDistance) {
      return this.props.t('PositionControl.noDistanceLimit');
    }
    return `${value / 1000} km`;
  };

  render() {
    const { t, geolocated } = this.props;
    return (
      <div className="app-PositionControl">
        <CheckboxControl
          id="geolocation-status"
          label={t('PositionControl.useDistance')}
          labelClassName="app-SearchControlsCheckbox__label"
          onConfirm={this.handleToggleChange}
          toggleClassName="app-SearchControlsCheckbox__toggle"
          value={geolocated}
        />
        {this.state.toggled && (
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
        )}
        {this.state.toggled && (
          <div>
            {t('PositionControl.maxDistance')}
:
            {this.distanceFormatter(this.state.distance)}
          </div>
        )}
      </div>
    );
  }
}

export default injectT(PositionControl);
