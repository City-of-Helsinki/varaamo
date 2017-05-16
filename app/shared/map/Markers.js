import React, { PropTypes } from 'react';
import { Marker } from 'react-leaflet';

import { getOwnerMarkerIcon } from 'screens/utils';
import Popup from './popup';

class Markers extends React.Component {
  constructor() {
    super();
    this.handleClose = this.handleClose.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.state = { isClicked: false };
  }

  handleClick(event) {
    event.target.openPopup();
    this.setState({ isClicked: true });
  }

  handleClose() {
    this.setState({ isClicked: false });
  }

  handleMouseOut(event) {
    if (!this.state.isClicked) {
      event.target.closePopup();
    }
  }

  handleMouseOver(event) {
    if (!this.state.isClicked) {
      event.target.openPopup();
    }
  }

  render() {
    return (
      <div>
        {this.props.markers.map(marker => (
          <Marker
            icon={getOwnerMarkerIcon(marker.owner)}
            key={marker.id}
            onClick={this.handleClick}
            onMouseOut={this.handleMouseOut}
            onMouseOver={this.handleMouseOver}
            onPopupClose={this.handleClose}
            position={[marker.latitude, marker.longitude]}
          >
            <Popup id={marker.id} />
          </Marker>
        ))}
      </div>
    );
  }
}

Markers.propTypes = {
  markers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    owner: PropTypes.string.isRequired,
  })),
};

export default Markers;
