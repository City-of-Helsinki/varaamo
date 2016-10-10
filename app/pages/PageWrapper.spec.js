import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import DocumentTitle from 'react-document-title';

import PageWrapper from './PageWrapper';

describe('pages/PageWrapper', () => {
  const defaultProps = {
    className: 'test-page',
    title: 'Test title',
  };

  function getWrapper(extraProps) {
    return shallow(
      <PageWrapper {...defaultProps} {...extraProps}>
        <h1>{'Rendered content'}</h1>
      </PageWrapper>
    );
  }

  it('renders DocumentTitle component', () => {
    const title = getWrapper().find(DocumentTitle);
    expect(title.prop('title')).to.equal('Test title - Varaamo');
  });

  it('renders a div with the className given in props', () => {
    const div = getWrapper().find(`.${defaultProps.className}`);
    expect(div.length).to.equal(1);
  });

  it('renders the page content', () => {
    const content = getWrapper().find('h1');
    expect(content).to.have.length(1);
    expect(content.text()).to.equal('Rendered content');
  });
});
