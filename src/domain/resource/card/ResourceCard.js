import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import get from 'lodash/get';

import injectT from '../../../../app/i18n/injectT';
import * as dataUtils from '../../../common/data/utils';
import * as urlUtils from '../../../common/url/utils';
import * as searchUtils from '../../search/utils';
import * as resourceUtils from '../utils';
import BackgroundImage from '../../../../app/shared/background-image/BackgroundImage';
import { getMainImage } from '../../../../app/utils/imageUtils';
import ResourceAvailability from '../../../../app/shared/resource-card/resource-availability/ResourceAvailability';
import UnpublishedLabel from '../../../../app/shared/label/unpublished/UnpublishedLabel';

class ResourceCard extends React.Component {
  static propTypes = {
    date: PropTypes.string,
    resource: PropTypes.object.isRequired,
    unit: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    history: PropTypes.object,
    location: PropTypes.object,
    intl: intlShape.isRequired,
    isStacked: PropTypes.bool,
  };

  getResourcePageLink = () => {
    const { date, resource } = this.props;

    return {
      pathname: resourceUtils.getResourcePageLink(resource),
      search: date ? urlUtils.getSearch({ date }) : '',
      state: { fromSearchResults: true },
    };
  };

  onSearchClick = (filters) => {
    const { history } = this.props;
    history.push(searchUtils.getSearchPageLink(filters));
  };

  render() {
    const {
      date,
      isStacked,
      resource,
      unit,
      intl,
    } = this.props;

    return (
      <div
        className={classNames('app-resourceCard', {
          'app-resourceCard__stacked': isStacked,
        })}
      >
        <Link className="app-resourceCard__image-link" onClick={this.handleLinkClick} to={this.getResourcePageLink()}>
          <BackgroundImage height={420} image={getMainImage(resource.images)} width={700} />
        </Link>
        <div className="app-resourceCard__content">
          <div className="app-resourceCard__unit-name">
            <a
              className="app-resourceCard__unit-name-link"
              onClick={() => this.onSearchClick({ unit: resource.unit })}
              role="button"
              tabIndex="-1"
            >
              <span>{dataUtils.getLocalizedFieldValue(unit.name, intl.locale)}</span>
            </a>
            <div className="app-resourceCard__unit-name-labels">
              <ResourceAvailability date={date} resource={resource} />
              {!resource.public && <UnpublishedLabel />}
            </div>
          </div>
          <Link onClick={this.handleLinkClick} to={this.getResourcePageLink()}>
            <h4>{dataUtils.getLocalizedFieldValue(resource.name, intl.locale)}</h4>
          </Link>
          <div className="app-resourceCard__description">
            {dataUtils.getLocalizedFieldValue(resource.description, intl.locale)}
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(injectT(withRouter(ResourceCard)));
