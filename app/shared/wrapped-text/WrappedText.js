import React, { PropTypes } from 'react';
import Linkify from 'react-linkify';

function renderParagraph(text, index) {
  return <div key={index}><Linkify>{text}</Linkify></div>;
}

function WrappedText({ text }) {
  return (
    <div className="wrapped-text">
      {text.split('\n').map(renderParagraph)}
    </div>
  );
}

WrappedText.propTypes = {
  text: PropTypes.string.isRequired,
};

export default WrappedText;
