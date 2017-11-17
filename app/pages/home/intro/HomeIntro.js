import React, { PropTypes } from 'react';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';
import { FormattedHTMLMessage } from 'react-intl';

import { injectT } from 'i18n';
import ShowResourcesLink from './ShowResourcesLink';

function HomeIntro({ t }) {
  return (
    <div className="home-intro">
      <div className="content">
        <Jumbotron>
          <h2>{t('HomeIntro.header')}</h2>
          <p>{t('HomeIntro.lead')}</p>
          <ShowResourcesLink />
          <h3><FormattedHTMLMessage id="HomeNewui.lead" /></h3>
        </Jumbotron>
      </div>
    </div>
  );
}

HomeIntro.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(HomeIntro);
