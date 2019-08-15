import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';

import { shallowWithIntl } from '../../../../utils/testUtils';
import ResourceSpecificTerms from '../ResourceSpecificTerms';

describe('pages/resource/resource-equipment/ResourceSpecificTerms', () => {
  const defaultProps = {
    resource: {
      specificTerms: 'specific terms and conditions content',
    }
  };

  function getWrapper(props) {
    return shallowWithIntl(<ResourceSpecificTerms {...defaultProps} {...props} />);
  }

  test('renders panel and specific terms heading', () => {
    const panels = getWrapper().find(Panel);
    const heading = getWrapper().find('h3');

    expect(panels).toHaveLength(1);
    expect(heading).toHaveLength(1);
    expect(heading.text()).toBe('ResourcePage.specificTerms');
  });

  test('renders specific terms content', () => {
    const specificTermsRow = getWrapper().find(Row);
    expect(specificTermsRow).toHaveLength(1);
    expect(specificTermsRow.html()).toContain(defaultProps.resource.specificTerms);
  });
});
