import 'moment/locale/en-gb';
import 'moment/locale/fi';
import 'moment/locale/sv';
import 'moment-timezone/builds/moment-timezone-with-data-10-year-range';
import moment from 'moment';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fi from 'react-intl/locale-data/fi';
import sv from 'react-intl/locale-data/sv';

import constants from '../constants/AppConstants';
import { loadPersistedLocale } from '../store/middleware/persistState';
import enMessages from './messages/en.json';
import fiMessages from './messages/fi.json';
import svMessages from './messages/sv.json';

const messages = {
  en: enMessages,
  fi: fiMessages,
  sv: svMessages,
};

moment.tz.setDefault(constants.TIME_ZONE);

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

moment.defineLocale('varaamo-sv', {
  parentLocale: 'sv',
});

addLocaleData([...en, ...fi, ...sv]);

function initI18n() {
  const persistedData = loadPersistedLocale();

  const locale = persistedData || constants.DEFAULT_LOCALE;
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
