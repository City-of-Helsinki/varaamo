import React, { PropTypes } from 'react';

import { getSearchPageUrl } from 'utils/searchUtils';
import PurposeListItem from './PurposeListItem';
import PrintingImage from './images/3d-printing.jpg';
import meetingsAndWorkingImage from './images/meeting-and-work.jpg';

const images = {
  '3d-printing-and-digitizing': PrintingImage,
  'have-a-meeting-or-work': meetingsAndWorkingImage,
};


function renderPurposeListItem(purpose) {
  return (
    <PurposeListItem
      imageUrl={images[purpose.id] || ''}
      key={purpose.id}
      linkUrl={getSearchPageUrl({ purpose: purpose.id })}
      text={purpose.name}
    />
  );
}

function PurposeList({ purposes }) {
  return (
    <div className="purpose-list">
      {purposes.map(renderPurposeListItem)}
    </div>
  );
}

const purposePropType = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
});

PurposeList.propTypes = {
  purposes: PropTypes.arrayOf(purposePropType).isRequired,
};

export default PurposeList;
