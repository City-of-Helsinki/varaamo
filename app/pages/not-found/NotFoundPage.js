import React, { PropTypes } from 'react';
import Well from 'react-bootstrap/lib/Well';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';

import PageWrapper from 'pages/PageWrapper';
import { injectT } from 'i18n';
import { getSearchPageUrl } from 'utils/searchUtils';

function NotFoundPage({ t }) {
  return (
    <PageWrapper title={t('NotFoundPage.title')}>
      <div>
        <h1>{t('NotFoundPage.title')}</h1>
        <p className="lead">{t('NotFoundPage.lead')}</p>
        <Well>
          <h5>{t('NotFoundPage.helpHeader')}</h5>
          <ul>
            <li>
              <FormattedMessage
                id="NotFoundPage.searchPage"
                values={{
                  searchPageLink: (
                    <Link to={getSearchPageUrl()}>
                      <FormattedMessage id="NotFoundPage.searchPageLink" />
                    </Link>
                  ),
                }}
              />
            </li>
            <li>{t('NotFoundPage.checkAddress')}</li>
            <li>{t('NotFoundPage.contactUs')}</li>
          </ul>
        </Well>
      </div>
    </PageWrapper>
  );
}

NotFoundPage.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(NotFoundPage);
