import classnames from 'classnames';
import React, { PropTypes } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

class PositionControl extends React.Component {
  static propTypes = {
    geolocated: PropTypes.bool,
    onPositionSwitch: PropTypes.func.isRequired,
  };

  render() {
    const { geolocated } = this.props;
    return (
      <div className="app-PositionControl">
        <Button
          className={classnames('app-PositionControl__show-button', {
            'app-PositionControl__active': geolocated,
          })}
          onClick={this.props.onPositionSwitch}
        >
          <Glyphicon glyph="map-marker" />
        </Button>
      </div>
    );
  }
}

export default PositionControl;
