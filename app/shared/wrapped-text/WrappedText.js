import PropTypes from 'prop-types';
import React from 'react';
import Linkify from 'react-linkify';

function renderParagraph(text, index, openLinksInNewTab) {
  const properties = openLinksInNewTab
    ? {
      rel: 'noopener noreferrer',
      target: '_blank',
    }
    : {};

  return (
    <div key={index}>
      <Linkify properties={properties}>{text}</Linkify>
    </div>
  );
}

function WrappedText({ text, openLinksInNewTab = false }) {
  if (!text) {
    return <div />;
  }
  return (
    <div className="wrapped-text">
      {text
        .split('\n')
        .map((paragraph, index) => renderParagraph(paragraph, index, openLinksInNewTab))}
    </div>
  );
}

WrappedText.propTypes = {
  text: PropTypes.string,
  openLinksInNewTab: PropTypes.bool,
};

export default WrappedText;
