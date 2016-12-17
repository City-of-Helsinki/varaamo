import { expect } from 'chai';
import React from 'react';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';

import { shallowWithIntl } from 'utils/testUtils';
import HomeIntro from './HomeIntro';
import ShowResourcesLink from './ShowResourcesLink';

describe('pages/home/intro/HomeIntro', () => {
  const wrapper = shallowWithIntl(<HomeIntro />);

  it('renders a Jumbotron component', () => {
    const jumbotron = wrapper.find(Jumbotron);
    expect(jumbotron.length).to.equal(1);
  });

  it('renders a h2 header with correct text', () => {
    const h2 = wrapper.find('h2');
    expect(h2).to.have.length(1);
    expect(h2.text()).to.equal('HomeIntro.header');
  });

  it('renders p tag with correct text', () => {
    const p = wrapper.find('p');
    expect(p).to.have.length(1);
    expect(p.text()).to.equal('HomeIntro.lead');
  });

  it('renders a ShowResourcesLink component', () => {
    expect(wrapper.find(ShowResourcesLink).length).to.equal(1);
  });
});
