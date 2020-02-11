import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import classNames from 'classnames';

import injectT from '../../../../app/i18n/injectT';

SearchMapToggle.propTypes = {
  active: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  resultCount: PropTypes.number.isRequired,
  t: PropTypes.func.isRequired,
};

const BUTTONS = [{
  key: 'list',
  label: 'MapToggle.showList',
}, {
  key: 'map',
  label: 'MapToggle.showMap',
}];

function SearchMapToggle({
  active,
  onClick,
  resultCount,
  t,
}) {
  return (
    <div className="app-SearchMapToggle">
      <Grid>
        <Row>
          <Col sm={6}>
            <div className="app-SearchMapToggle__results-count">
              {resultCount ? t('MapToggle.resultsText', { count: resultCount }) : t('MapToggle.noResultsText')}
            </div>
          </Col>
          <Col sm={6}>
            <div className="pull-right">
              {BUTTONS.map((button) => {
                const isSelected = active === button.key;

                return (
                  <Button
                    aria-selected={isSelected}
                    className={classNames(
                      'app-SearchMapToggle__button',
                      `app-SearchMapToggle__button-${button.key}`,
                      { 'app-SearchMapToggle__button--selected': isSelected },
                    )}
                    key={button.key}
                    onClick={() => onClick(button.key)}
                    role="tab"
                  >
                    {t(button.label)}
                  </Button>
                );
              })}
            </div>
          </Col>
        </Row>
      </Grid>
    </div>
  );
}

export default injectT(SearchMapToggle);
