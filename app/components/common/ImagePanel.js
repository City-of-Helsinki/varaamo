import map from 'lodash/collection/map';
import React, { Component, PropTypes } from 'react';
import Panel from 'react-bootstrap/lib/Panel';

import { getCaption } from 'utils/DataUtils';

class ImagePanel extends Component {
  constructor(props) {
    super(props);
    this.renderImage = this.renderImage.bind(this);
  }

  renderImage(image, index) {
    const alt = getCaption(image) || this.props.altText;
    const src = image.url;
    const imageStyles = {
      width: '100%',
      marginTop: index > 0 ? '15px' : 0,
    };

    return (
      <img
        alt={alt}
        key={image.url}
        src={src}
        style={imageStyles}
      />
    );
  }

  render() {
    const { images } = this.props;

    if (!images.length) {
      return null;
    }

    return (
      <Panel
        collapsible
        id="image-panel"
        header="Kuvat"
      >
        {map(images, this.renderImage)}
      </Panel>
    );
  }
}

ImagePanel.propTypes = {
  altText: PropTypes.string.isRequired,
  images: PropTypes.array.isRequired,
};

export default ImagePanel;
