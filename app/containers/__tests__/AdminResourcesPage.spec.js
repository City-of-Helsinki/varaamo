import { expect } from 'chai';
import { shallow } from 'enzyme';
import moment from 'moment';
import React from 'react';
import Loader from 'react-loader';
import simple from 'simple-mock';

import ResourcesTable from 'components/resource/ResourcesTable';
import {
  UnconnectedAdminResourcesPage as AdminResourcesPage,
} from 'containers/AdminResourcesPage';

describe('Container: AdminResourcesPage', () => {
  const fetchResources = simple.stub();

  const defaultProps = {
    actions: {
      fetchResources,
    },
    isAdmin: true,
    isFetchingResources: false,
    resources: [],
  };

  function getWrapper(extraProps = {}) {
    return shallow(<AdminResourcesPage {...defaultProps} {...extraProps} />);
  }

  describe('rendering', () => {
    describe('when user is not admin', () => {
      let wrapper;
      before(() => {
        wrapper = getWrapper({ isAdmin: false });
      });

      it('renders a paragraph', () => {
        expect(wrapper.find('p')).to.have.length(1);
      });

      it('renders correct text in paragraph', () => {
        expect(wrapper.find('p').text()).to.equal(
          'Tarvitset virkailijan oikeudet nähdäksesi tämän sivun.'
        );
      });
    });

    describe('when user is an admin', () => {
      const wrapper = getWrapper({ isAdmin: true });

      it('should display "Omat tilat" -title inside h1 tags', () => {
        const h1 = wrapper.find('h1');
        expect(h1.text()).to.equal('Omat tilat');
      });

      it('renders a loader with a loaded prop if resources has been fetched', () => {
        expect(wrapper.find(Loader).prop('loaded')).to.be.true;
      });

      it('renders a loader without loaded prop if resources has not been fetched', () => {
        const currentWrapper = getWrapper({ isFetchingResources: true });
        expect(currentWrapper.find(Loader).prop('loaded')).to.be.false;
      });
      describe('resources table', () => {
        let resourcesTable;
        before(() => {
          resourcesTable = wrapper.find(ResourcesTable);
        });

        it('exists', () => {
          expect(resourcesTable).to.have.length(1);
        });

        it('has correct emptyMessage prop', () => {
          expect(resourcesTable.prop('emptyMessage')).to.equal(
            'Sinulla ei vielä ole yhtään omia tiloja näytettäväksi'
          );
        });

        it('has correct resources prop', () => {
          expect(resourcesTable.prop('resources')).to.deep.equal([]);
        });
      });
    });
  });

  describe('componentDidMount', () => {
    describe('if user is an admin', () => {
      before(() => {
        fetchResources.reset();
        getWrapper({ isAdmin: true }).instance().componentDidMount();
      });

      it('should fetch resources', () => {
        expect(fetchResources.callCount).to.equal(1);
      });

      it('should fetch today\'s resources', () => {
        const args = fetchResources.lastCall.args;
        expect(args[0]).to.deep.equal({
          end: moment().endOf('day').toISOString(),
          start: moment().startOf('day').toISOString(),
        });
        expect(args[1]).to.equal('adminResourcesPage');
      });
    });
  });
});
