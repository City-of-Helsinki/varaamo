import * as urlUtils from '../utils';

describe('src/common/url/utils.js', () => {
  const query = {
    foo: 'foo',
    bar: 'foo,bar',
    baz: ['foo', 'bar', 'baz'],
  };

  describe('getSearch', () => {
    test('Test most generic cases of query parameters', () => {
      const actual = urlUtils.getSearch(query);
      expect(actual).toBe('foo=foo&bar=foo%2Cbar&baz=foo%2Cbar%2Cbaz');
    });
  });

  describe('getLinkString', () => {
    const withQuery = urlUtils.getLinkString('testPath', query);
    expect(withQuery).toBe('testPath?foo=foo&bar=foo%2Cbar&baz=foo%2Cbar%2Cbaz');

    const withoutQuery = urlUtils.getLinkString('testPath');
    expect(withoutQuery).toBe('testPath');
  });
});
