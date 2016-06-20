import React, { Component, PropTypes } from 'react';
import AutoLinkText from 'react-autolink-text';

class WrappedText extends Component {
  renderParagraph(text, index) {
    return <div key={index}><AutoLinkText text={text} /></div>;
  }

  render() {
    const { text } = this.props;
    return (
      <div className="wrapped-text">
        {text.split('\n').map(this.renderParagraph)}
      </div>
    );
  }
}

WrappedText.propTypes = {
  text: PropTypes.string.isRequired,
};

export default WrappedText;
