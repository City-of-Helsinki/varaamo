import { shallow } from 'enzyme';
import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
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
        <h1>Rendered content</h1>
      </PageWrapper>
    );
  }

  test('renders DocumentTitle component', () => {
    const title = getWrapper().find(DocumentTitle);
    expect(title.prop('title')).toBe('Test title - Varaamo');
  });

  test('renders a div with the className given in props', () => {
    const div = getWrapper().find(`.${defaultProps.className}`);
    expect(div.length).toBe(1);
  });

  test('renders the page content', () => {
    const content = getWrapper().find('h1');
    expect(content).toHaveLength(1);
    expect(content.text()).toBe('Rendered content');
  });

  test('renders a normal Grid', () => {
    const gridWrapper = getWrapper().find(Grid);
    expect(gridWrapper).toHaveLength(1);
  });

  test('renders a fluid Grid if fluid prop', () => {
    const gridWrapper = getWrapper({ fluid: true }).find(Grid);
    expect(gridWrapper).toHaveLength(1);
  });
});
