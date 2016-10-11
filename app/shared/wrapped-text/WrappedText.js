import React, { PropTypes } from 'react';
import AutoLinkText from 'react-autolink-text';

function renderParagraph(text, index) {
  return <div key={index}><AutoLinkText text={text} /></div>;
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
