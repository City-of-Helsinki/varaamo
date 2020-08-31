import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Checkbox, Button } from 'hds-react';
import without from 'lodash/without';
import findIndex from 'lodash/findIndex';

import injectT from '../../../app/i18n/injectT';
import { getSelA11yPref, setSelA11yPref } from './utils';

const AccessibilityMenu = ({
  handleClose,
  locale,
  t,
  viewpoints,
}) => {
  const [selectedViewpoints, setSelectedViewpoints] = useState(getSelA11yPref());

  const handleCheck = viewpoint => (e) => {
    if (e.target.checked && !selectedViewpoints.includes(viewpoint.viewpointId)) {
      setSelectedViewpoints(prevState => [...prevState, viewpoint.viewpointId]);
    }

    if (!e.target.checked) setSelectedViewpoints(without(selectedViewpoints, viewpoint.viewpointId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setSelA11yPref(selectedViewpoints);
    handleClose();
  };

  return (
    <form className="app-AccessibilityMenu" onSubmit={handleSubmit}>
      <div className="app-AccessibilityMenu__btn-wrapper">
        <Button className="app-AccessibilityMenu__btn" theme="black" type="submit">{t('Save')}</Button>
        <Button className="app-AccessibilityMenu__btn" onClick={handleClose} theme="black" variant="secondary">
          {t('Close')}
        </Button>
      </div>
      <hr />
      <div className="app-AccessibilityMenu__options-wrapper">
        {viewpoints.map((viewpoint) => {
          const langIndex = findIndex(viewpoint.names, name => (name.language === locale)) || 0;
          const label = viewpoint.names[langIndex] ? viewpoint.names[langIndex].value : '';

          return (
            <Checkbox
              checked={selectedViewpoints.includes(viewpoint.viewpointId)}
              className="app-AccessibilityMenu__checkbox"
              id={`accessibility-checkbox-${viewpoint.viewpointId}`}
              key={viewpoint.viewpointId}
              label={label}
              onChange={handleCheck(viewpoint)}
            />
          );
        })}
      </div>
    </form>
  );
};

AccessibilityMenu.propTypes = {
  handleClose: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
  viewpoints: PropTypes.array.isRequired,
};

export default injectT(AccessibilityMenu);
