import { updateIntl } from 'react-intl-redux';

import enMessages from 'translations/en.json';
import fiMessages from 'translations/fi.json';
import svMessages from 'translations/sv.json';

const messages = {
  fi: fiMessages,
  en: enMessages,
  sv: svMessages,
};

function changeLanguage(language) {
  const locale = language === 'sv' ? 'se' : language;
  return updateIntl({
    locale,
    messages: messages[language],
  });
}

export default changeLanguage;
