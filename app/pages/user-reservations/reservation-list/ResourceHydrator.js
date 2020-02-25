import PropTypes from 'prop-types';
import {
  useState, useEffect, useCallback, useRef,
} from 'react';
import get from 'lodash/get';

import client from '../../../../src/common/api/client';

const useIntersectionObserver = (root, target, onIntersect, threshold = 1.0, rootMargin = '0px') => {
  useEffect(
    () => {
      const currentTarget = target.current;
      const observer = new IntersectionObserver(onIntersect, {
        root: root.current,
        rootMargin,
        threshold,
      });

      observer.observe(currentTarget);

      return () => {
        observer.unobserve(currentTarget);
      };
    },
  );
};

const useHydratedResource = () => {
  const isMounted = useRef(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetch = useCallback((resourceId) => {
    setLoading(true);

    client.get(`resource/${resourceId}`)
      .then((response) => {
        if (!isMounted.current) {
          return;
        }

        setLoading(false);
        setData(get(response, 'data', null));
      })
      .catch((e) => {
        if (!isMounted.current) {
          return;
        }

        setError(e);
      });
  }, []);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  });

  return [fetch, {
    loading,
    data,
    error,
  }];
};


const ResourceHydrator = ({ id, children, wrappingRef }) => {
  const [fetch, res] = useHydratedResource();
  const [isIntersecting, setIntersecting] = useState(false);

  const handleOnIntersect = ([entry]) => {
    setIntersecting(entry.isIntersecting);
  };

  useIntersectionObserver(window, wrappingRef, handleOnIntersect, 0);
  useEffect(() => {
    if (isIntersecting) {
      fetch(id);
    }
  }, [fetch, id, isIntersecting]);


  return children(res);
};

ResourceHydrator.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  wrappingRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

export default ResourceHydrator;
