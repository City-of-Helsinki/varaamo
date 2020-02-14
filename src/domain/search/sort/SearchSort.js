import PropTypes from 'prop-types';
import React from 'react';

import injectT from '../../../../app/i18n/injectT';
import SelectFilter from '../filters/filter/SelectFilter';

const UntranslatedSearchSort = ({
  t,
  locale,
  onChange,
  value,
}) => {
  const sortOptions = [
    { label: t('SearchSort.nameLabel'), value: `resource_name_${locale}` },
    { label: t('SearchSort.typeLabel'), value: `type_name_${locale}` },
    { label: t('SearchSort.premiseLabel'), value: `unit_name_${locale}` },
    { label: t('SearchSort.peopleLabel'), value: 'people_capacity' },
  ];
  const option = sortOptions.find(options => options.value === value);
  const label = !option ? t('SearchSort.premiseLabel') : option.label;

  return (
    <div className="app-SearchSort">
      <div className="sr-only" data-testid="sort-order-announcer" role="status">
        {t('SearchSort.sortingStyle') + label}
      </div>
      <SelectFilter
        id="app-Sort"
        isSearchable={false}
        label={t('SearchSort.label')}
        onChange={item => onChange(item.value)}
        options={sortOptions}
        value={value}
      />
    </div>
  );
};

UntranslatedSearchSort.propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string,
  locale: PropTypes.string,
};

export { UntranslatedSearchSort };

export default injectT(UntranslatedSearchSort);
