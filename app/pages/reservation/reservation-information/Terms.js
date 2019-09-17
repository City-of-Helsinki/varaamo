/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedHTMLMessage } from 'react-intl';

import Error from './Error';
import injectT from '../../../i18n/injectT';

function Terms({
  input,
  meta: { error, touched },
  t,
  labelId,
  link,
}) {
  return (
    <div className="app-ReservationPage__formfield">
      <label>
        <input {...input} type="checkbox" />
        <FormattedHTMLMessage id={labelId} values={{ link }} />
      </label>
      {touched && error && <Error error={t(error)} />}
    </div>
  );
}

Terms.propTypes = {
  input: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  labelId: PropTypes.string.isRequired,
  link: PropTypes.string,
};

export default injectT(Terms);
