import React, { PropTypes } from 'react';

import { injectT } from 'i18n';

function ResultsCount({ emptyMessage, resultIds, t }) {
  const count = resultIds.length;
  return (
    <div id="results-count">
      {count ? t('ResultsCount.text', { count }) : emptyMessage}
    </div>
  );
}

ResultsCount.propTypes = {
  emptyMessage: PropTypes.string.isRequired,
  resultIds: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ResultsCount);
