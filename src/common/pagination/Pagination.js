import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';

import injectT from '../../../app/i18n/injectT';

class Pagination extends React.Component {
  static propTypes = {
    pages: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  renderPages = () => {
    const { pages, page, onChange } = this.props;

    const buttons = [];
    for (let i = 0; i < pages; ++i) {
      buttons.push(
        <Button
          className={classNames('app-SearchPagination__page', `app-SearchPagination__page-${i + 1}`, {
            'app-SearchPagination__selected': i + 1 === page,
          })}
          key={`pageButton-${i}`}
          onClick={() => onChange(i + 1)}
        >
          {i + 1}
        </Button>
      );
    }

    return buttons;
  };

  render() {
    const {
      pages,
      page,
      onChange,
      t
    } = this.props;

    return (
      <div className="app-SearchPagination">
        <Button
          className="app-SearchPagination__prev"
          disabled={page === 1}
          onClick={() => onChange(Math.max(1, page - 1))}
        >
          {t('common.previous')}
        </Button>
        {this.renderPages()}
        <Button
          className="app-SearchPagination__next"
          disabled={page >= pages}
          onClick={() => onChange(Math.min(pages, page + 1))}
        >
          {t('common.next')}
        </Button>
      </div>
    );
  }
}

export default injectT(Pagination);
