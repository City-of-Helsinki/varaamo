import React from 'react';
import { Link } from 'react-router';

import { getSearchPageUrl } from 'utils/SearchUtils';

function ShowResourcesLink() {
  return (
    <Link
      className="show-resources-link"
      to={getSearchPageUrl({ purpose: 'all' })}
    >
      Näytä kaikki tilat ja laitteet
    </Link>
  );
}

ShowResourcesLink.propTypes = {};

export default ShowResourcesLink;
