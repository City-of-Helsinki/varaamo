/* eslint-disable react/no-danger */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import serialize from 'serialize-javascript';
import isPlainObject from 'lodash/isPlainObject';
import pick from 'lodash/pick';

import settings, { ENV_NAMESPACE } from '../config/settings';

const CLIENT_ENV = [
  'API_URL',
  'ACCESSIBILITY_API_URL',
  'SHOW_TEST_SITE_MESSAGE',
  'TRACKING',
  'CUSTOM_MUNICIPALITY_OPTIONS',
  'TIME_ZONE',
  'FIREBASE',
];

class Html extends Component {
  getInitialStateHtml(initialState) {
    return `window.INITIAL_STATE = ${serialize(initialState)};`;
  }

  renderAnalyticsCode(piwikSiteId) {
    if (!piwikSiteId) {
      return null;
    }

    const scriptString = `
      var _paq = _paq || [];
      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);
      (function() {
        var u="https://analytics.hel.ninja/";
        _paq.push(['setTrackerUrl', u+'matomo.php']);
        _paq.push(['setSiteId', ${piwikSiteId}]);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript';
        g.async=true;
        g.defer=true;
        g.src=u+'matomo.js';
        s.parentNode.insertBefore(g,s);
      })();
    `;
    const imgSrc = `//analytics.hel.ninja/matomo.php?idsite=${piwikSiteId}&amp;rec=1`;
    return (
      <div>
        <script dangerouslySetInnerHTML={{ __html: scriptString }} />
        <noscript>
          <p><img alt="" src={imgSrc} style={{ border: 0 }} /></p>
        </noscript>
      </div>
    );
  }

  renderStylesLink(appCssSrc, isProduction) {
    if (!isProduction) {
      return null;
    }

    return <link href={appCssSrc} rel="stylesheet" />;
  }

  render() {
    const {
      appCssSrc,
      appScriptSrc,
      initialState,
      isProduction,
      piwikSiteId,
    } = this.props;
    const initialStateHtml = this.getInitialStateHtml(initialState);

    return (
      <html lang="fi">
        <head>
          <meta charSet="utf-8" />
          <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <link
            href="https://overpass-30e2.kxcdn.com/overpass.css"
            rel="stylesheet"
          />
          {this.renderStylesLink(appCssSrc, isProduction)}
          <title>Varaamo</title>
        </head>
        <body>
          <div id="root" />
          <script
            dangerouslySetInnerHTML={{
              __html: stringifyStateIntoWindow(ENV_NAMESPACE, pick(settings, CLIENT_ENV)),
            }}
          />
          <script dangerouslySetInnerHTML={{ __html: initialStateHtml }} />
          {/* eslint-disable-next-line max-len */}
          <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.en-gb,Intl.~locale.fi,Intl.~locale.sv" />
          <script src={appScriptSrc} />
          {this.renderAnalyticsCode(piwikSiteId)}
        </body>
      </html>
    );
  }
}

Html.propTypes = {
  appCssSrc: PropTypes.string.isRequired,
  appScriptSrc: PropTypes.string.isRequired,
  initialState: PropTypes.object.isRequired,
  isProduction: PropTypes.bool.isRequired,
  piwikSiteId: PropTypes.string,
};

export default Html;

function getLine(path, value) {
  return `window.${path.join('.')} = ${JSON.stringify(value)};\n`;
}

function getLines(path = [], stateObject) {
  return Object.entries(stateObject).reduce((acc, [key, value]) => {
    if (value !== null && isPlainObject(value)) {
      return [
        ...acc,
        getLine([...path, key], {}),
        ...getLines([...path, key], value),
      ];
    }

    return [...acc, getLine([...path, key], value)];
  }, []);
}

function stringifyStateIntoWindow(key, stateObject) {
  let template = '';

  template += getLine([key], {});
  template += getLines([key], stateObject).join('');

  return template;
}
