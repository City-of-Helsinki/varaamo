import React, { PropTypes } from 'react';

function ResultsCount({ emptyMessage, resultIds }) {
  const count = resultIds.length;
  return (
    <div id="results-count">
      {count ?
        `Tiloja löytyi ${count} kpl.` :
        emptyMessage
      }
    </div>
  );
}

ResultsCount.propTypes = {
  emptyMessage: PropTypes.string.isRequired,
  resultIds: PropTypes.array.isRequired,
};

export default ResultsCount;
