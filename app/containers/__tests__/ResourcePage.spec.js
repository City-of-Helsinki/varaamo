import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { LinkContainer } from 'react-router-bootstrap';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import ImagePanel from 'components/common/ImagePanel';
import ResourceDetails from 'components/resource/ResourceDetails';
import ResourceHeader from 'components/resource/ResourceHeader';
import { UnconnectedResourcePage as ResourcePage } from 'containers/ResourcePage';
import Resource from 'fixtures/Resource';
import Unit from 'fixtures/Unit';
import FavoriteButtonContainer from 'screens/shared/favorite-button';

describe('Container: ResourcePage', () => {
  const unit = Unit.build();
  const images = [{ url: 'some-url', caption: 'some caption' }];
  const resource = Resource.build({
    images,
    unit: Unit.id,
  });
  const defaultProps = {
    actions: { fetchResource: simple.stub() },
    date: '2015-12-12',
    id: resource.id,
    isAdmin: false,
    isFetchingResource: false,
    isLoggedIn: true,
    resource: Immutable(resource),
    unit: Immutable(unit),
  };

  function getWrapper(props) {
    return shallow(<ResourcePage {...defaultProps} {...props} />);
  }
  let wrapper;
  before(() => {
    wrapper = getWrapper();
  });

  describe('rendering a link to reservation page', () => {
    let linkWrapper;

    before(() => {
      linkWrapper = wrapper.find(LinkContainer);
    });

    it('should display a link to this resources reservation page', () => {
      const expected = (
        `/resources/${defaultProps.resource.id}/reservation?date=${defaultProps.date}`
      );

      expect(linkWrapper.prop('to')).to.equal(expected);
    });

    it('should display the link as a Button', () => {
      const buttonWrapper = linkWrapper.find(Button);

      expect(buttonWrapper.length).to.equal(1);
    });

    it('the link button should have text "Varaa tila"', () => {
      const buttonWrapper = linkWrapper.find(Button);

      expect(buttonWrapper.prop('children')).to.equal('Varaa tila');
    });
  });

  describe('rendering ResourceHeader', () => {
    let resoucerHeaderWrapper;

    before(() => {
      resoucerHeaderWrapper = wrapper.find(ResourceHeader);
    });

    it('should render ResourceHeader component', () => {
      expect(resoucerHeaderWrapper.length).to.equal(1);
    });

    it('should pass correct props to ResourceHeader component', () => {
      const actualProps = resoucerHeaderWrapper.props();

      expect(actualProps.name).to.equal(defaultProps.resource.name.fi);
      expect(typeof actualProps.address).to.equal('string');
    });
  });

  describe('rendering ResourceDetails', () => {
    let resourceDetailsWrapper;

    before(() => {
      resourceDetailsWrapper = wrapper.find(ResourceDetails);
    });

    it('should render ResourceDetails component', () => {
      expect(resourceDetailsWrapper.length).to.equal(1);
    });

    it('should pass correct props to ResourceDetails component', () => {
      const actualProps = resourceDetailsWrapper.props();

      expect(typeof actualProps.capacityString).to.equal('string');
      expect(typeof actualProps.description).to.equal('string');
      expect(typeof actualProps.type).to.equal('string');
    });
  });

  describe('rendering ImagePanel', () => {
    let imagePanelWrapper;

    before(() => {
      imagePanelWrapper = wrapper.find(ImagePanel);
    });

    it('should render ImagePanel component', () => {
      expect(imagePanelWrapper.length).to.equal(1);
    });

    it('should pass correct props to ImagePanel component', () => {
      const actualProps = imagePanelWrapper.props();
      const expectedAltText = `Kuva ${resource.name.fi} tilasta`;

      expect(actualProps.altText).to.equal(expectedAltText);
      expect(actualProps.images).to.deep.equal(resource.images);
    });
  });

  describe('fetching data', () => {
    before(() => {
      const instance = wrapper.instance();
      instance.componentDidMount();
    });

    it('should fetch resource data when component mounts', () => {
      expect(defaultProps.actions.fetchResource.callCount).to.equal(1);
    });
  });
});
