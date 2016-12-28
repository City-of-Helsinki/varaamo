import 'moment/locale/en-gb';
import 'moment/locale/fi';
import 'moment/locale/sv';
import 'moment-timezone';

import get from 'lodash/get';
import moment from 'moment';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fi from 'react-intl/locale-data/fi';
import se from 'react-intl/locale-data/se';

import constants from 'constants/AppConstants';
import enMessages from 'i18n/messages/en.json';
import fiMessages from 'i18n/messages/fi.json';
import svMessages from 'i18n/messages/sv.json';

const messages = {
  en: enMessages,
  fi: fiMessages,
  se: svMessages,
};

moment.tz.setDefault('Europe/Helsinki');

moment.defineLocale('varaamo-en', {
  parentLocale: 'en-gb',
});

moment.defineLocale('varaamo-fi', {
  parentLocale: 'fi',
  longDateFormat: {
    LT: 'H:mm',
    LLL: 'Do MMMM[ta] [klo] LT',
  },
});

moment.defineLocale('varaamo-se', {
  parentLocale: 'sv',
});

addLocaleData([...en, ...fi, ...se]);

function initI18n() {
  const persistedData = JSON.parse(localStorage.getItem('redux-localstorage'));
  const locale = get(persistedData, 'intl.locale', constants.DEFAULT_LOCALE);
  moment.locale(`varaamo-${locale}`);
  const initialIntlState = {
    intl: {
      defaultLocale: constants.DEFAULT_LOCALE,
      locale,
      messages: messages[locale],
    },
  };
  return initialIntlState;
}

export default initI18n;
