import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import { LinkContainer } from 'react-router-bootstrap';
import Immutable from 'seamless-immutable';

import Resource from 'utils/fixtures/Resource';
import { getResourcePageUrl } from 'utils/resourceUtils';
import ReserveButton from './ReserveButton';

describe('shared/resource-list/ReserveButton', () => {
  const defaultProps = {
    date: '2015-10-10',
    isLoggedIn: false,
    resource: Immutable(Resource.build({
      needManualConfirmation: false,
      reservable: false,
    })),
  };

  function getWrapper(extraProps) {
    return shallow(<ReserveButton {...defaultProps} {...extraProps} />);
  }

  function getButton({ isLoggedIn = false, needManualConfirmation = false, reservable = false }) {
    const extraProps = {
      isLoggedIn,
      resource: { needManualConfirmation, reservable },
    };
    return getWrapper(extraProps).find(Button);
  }

  it('renders a LinkContainer to reservation page', () => {
    const linkContainer = getWrapper().find(LinkContainer);
    const expectedUrl = getResourcePageUrl(defaultProps.resource, defaultProps.date);

    expect(linkContainer.length).to.equal(1);
    expect(linkContainer.props().to).to.equal(expectedUrl);
  });

  describe('Button', () => {
    it('is rendered', () => {
      const button = getWrapper().find(Button);
      expect(button.length).to.equal(1);
    });

    describe('if user is logged in', () => {
      const isLoggedIn = true;

      describe('if resource is reservable', () => {
        const reservable = true;

        describe('if resource needs manual confirmation', () => {
          const needManualConfirmation = true;

          it('has text "Tee alustava varaus"', () => {
            const button = getButton({ isLoggedIn, needManualConfirmation, reservable });
            expect(button.props().children).to.equal('Tee alustava varaus');
          });
        });

        describe('if resource does not need manual confirmation', () => {
          const needManualConfirmation = false;

          it('has text "Varaa"', () => {
            const button = getButton({ isLoggedIn, needManualConfirmation, reservable });
            expect(button.props().children).to.equal('Varaa');
          });
        });
      });

      describe('if resource is not reservable', () => {
        const reservable = false;

        it('has text "Katso varaustilanne"', () => {
          const button = getButton({ isLoggedIn, reservable });
          expect(button.props().children).to.equal('Katso varaustilanne');
        });
      });
    });

    describe('if user is not logged in', () => {
      const isLoggedIn = false;

      it('has text "Katso varaustilanne"', () => {
        const button = getButton({ isLoggedIn });
        expect(button.props().children).to.equal('Katso varaustilanne');
      });
    });
  });
});
