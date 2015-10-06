import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import Loader from 'react-loader';

import PurposeCategory from 'components/purpose/PurposeCategory';

export class PurposeCategoryList extends Component {
  constructor(props) {
    super(props);
    this.renderPurposeCategory = this.renderPurposeCategory.bind(this);
  }

  renderPurposeCategory(mainType) {
    const purposes = this.props.purposeCategories[mainType];

    return (
      <PurposeCategory
        key={mainType}
        mainType={mainType}
        purposes={purposes}
      />
    );
  }

  render() {
    const { purposeCategories } = this.props;

    return (
      <Loader loaded={!_.isEmpty(purposeCategories)}>
        <div>
          {_.map(_.keys(purposeCategories), this.renderPurposeCategory)}
        </div>
      </Loader>
    );
  }
}

PurposeCategoryList.propTypes = {
  purposeCategories: PropTypes.object.isRequired,
};

export default PurposeCategoryList;
