import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Jumbotron from 'react-bootstrap/lib/Jumbotron';

import HomeIntro from './HomeIntro';
import ShowResourcesLink from './ShowResourcesLink';

describe('pages/home/intro/HomeIntro', () => {
  const wrapper = shallow(<HomeIntro />);

  it('renders a Jumbotron component', () => {
    const jumbotron = wrapper.find(Jumbotron);
    expect(jumbotron.length).to.equal(1);
  });

  it('renders a h2 header with correct text', () => {
    const h2 = wrapper.find('h2');
    const expected = 'Tilat ja laitteet varattavana';
    expect(h2.text()).to.equal(expected);
  });

  it('renders additional text inside p tag', () => {
    const p = wrapper.find('p');
    const expected = 'Varaamosta voit varata julkisia tiloja ja laitteita omaan käyttöösi';
    expect(p.text()).to.equal(expected);
  });

  it('renders a ShowResourcesLink component', () => {
    expect(wrapper.find(ShowResourcesLink).length).to.equal(1);
  });
});
