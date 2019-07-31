import { getResourcePageLink } from '../utils';

describe('domain resource utility function', () => {
  describe('getResourcePageLink', () => {
    const resource = {
      id: 'foo'
    };

    test('should return link with resource as part of url', () => {
      const link = getResourcePageLink(resource);
      expect(link).toContain('/resources/');
    });

    test('should return link with resource id', () => {
      const link = getResourcePageLink(resource);
      expect(link).toContain(resource.id);
    });

    test('should be fine even when resource has no id', () => {
      const link = getResourcePageLink({});
      expect(link).toBeDefined();
    });

    test('can append more query to the link', () => {
      const link = getResourcePageLink(resource, 'foo=bar');
      expect(link).toContain('bar');
    });
  });
});
