import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';

import injectT from '../../../app/i18n/injectT';

const LINK_COUNT = 9;

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

    const links = Math.floor(LINK_COUNT / 2);
    let start = Math.max(page - links, 1);
    let end = Math.min(page + links, pages);

    if (end - start < LINK_COUNT - 1) {
      if (start === 1 && end < pages) {
        end = Math.min(start + (LINK_COUNT - 1), pages);
      } else if (end === pages && start > 1) {
        start = Math.max(end - (LINK_COUNT - 1), 1);
      }
    }

    for (let i = start - 1; i < end; ++i) {
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
        {!!pages && this.renderPages()}
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
