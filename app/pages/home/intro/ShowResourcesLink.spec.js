import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import { Link } from 'react-router';

import { getSearchPageUrl } from 'utils/searchUtils';
import ShowResourcesLink from './ShowResourcesLink';

describe('pages/home/intro/ShowResourcesLink', () => {
  const wrapper = shallow(<ShowResourcesLink />);

  it('renders a Link component', () => {
    const link = wrapper.find(Link);
    expect(link.length).to.equal(1);
  });

  it('the Link has correct url', () => {
    const link = wrapper.find(Link);
    const expectedUrl = getSearchPageUrl({ purpose: 'all' });
    expect(link.props().to).to.equal(expectedUrl);
  });
});
