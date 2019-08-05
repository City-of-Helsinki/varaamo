import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl, intlShape } from 'react-intl';

import injectT from '../../../../app/i18n/injectT';
import SelectFilter from '../filters/filter/SelectFilter';

const SearchSort = ({
  t,
  intl,
  onChange,
  value,
}) => {
  return (
    <div className="app-SearchSort">
      <SelectFilter
        id="app-Sort"
        isSearchable={false}
        label={t('SortBy.label')}
        onChange={item => onChange(item.value)}
        options={[
          { label: t('SearchSort.nameLabel'), value: `resource_name_${intl.locale}` },
          { label: t('SearchSort.typeLabel'), value: `type_name_${intl.locale}` },
          { label: t('SearchSort.premiseLabel'), value: `unit_name_${intl.locale}` },
          { label: t('SearchSort.peopleLabel'), value: 'people_capacity' },
        ]}
        value={value}
      />
    </div>
  );
};

SearchSort.propTypes = {
  t: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
};

export default injectIntl(injectT(SearchSort));
