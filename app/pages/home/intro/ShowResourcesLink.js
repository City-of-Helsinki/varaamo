import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import { injectT } from 'i18n';
import { getSearchPageUrl } from 'utils/searchUtils';

function ShowResourcesLink({ t }) {
  return (
    <Link
      className="show-resources-link"
      to={getSearchPageUrl({ purpose: 'all' })}
    >
      {t('ShowResourcesLink.text')}
    </Link>
  );
}

ShowResourcesLink.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(ShowResourcesLink);
