import 'moment/locale/en-gb';
import 'moment/locale/fi';
import 'moment/locale/sv';
import 'moment-timezone';

import moment from 'moment';
import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import fi from 'react-intl/locale-data/fi';
import se from 'react-intl/locale-data/se';

import constants from 'constants/AppConstants';
import fiMessages from 'i18n/messages/fi.json';

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

function initI18n(locale = constants.DEFAULT_LANGUAGE) {
  addLocaleData([...en, ...fi, ...se]);
  moment.locale(`varaamo-${locale}`);

  const initialIntlState = {
    intl: {
      defaultLocale: locale,
      locale,
      messages: fiMessages,
    },
  };

  return initialIntlState;
}

export default initI18n;
