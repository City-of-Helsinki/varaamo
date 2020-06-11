import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';

import useDropdownDocumentEvents from './useDropdownDocumentEvents';
import AsPolymorph from '../as-polymorph/AsPolymorph';

const BOOTSTRAP_INJECTED_PROPS = ['activeKey', 'activeHref'];

function TabbableNavDropdown({ renderToggle, children, className, ...rest }) {
  const dropdown = React.useRef();
  const [isOpen, setOpen] = React.useState(false);
  const [
    setUpDocumentEvents,
    tearDownDocumentEvents,
  ] = useDropdownDocumentEvents(dropdown, setOpen);

  const handleToggleElementClick = (event) => {
    event.preventDefault();
    setOpen((prevIsOpen) => !prevIsOpen);
  };

  const closeMenu = React.useCallback(() => {
    setOpen(false);
  }, []);

  React.useEffect(() => {
    setUpDocumentEvents();
    return () => {
      tearDownDocumentEvents();
    };
  }, [setUpDocumentEvents, tearDownDocumentEvents]);

  // This component is used as a child of a bootstrap component that injects
  // props to its children. Here we are ignoring at least some of them in order
  // to avoid from passing them into the dom.
  const safeRest = omit(rest, BOOTSTRAP_INJECTED_PROPS);

  return (
    // In order to make boostrap's dropdown styles work, we need to set "open"
    // on this element (it wraps "dropdown-menu").
    //
    // With this implementation we can use the styles for the dropdown directly
    // from bootstrap.
    <AsPolymorph
      ref={dropdown}
      {...safeRest}
      className={classNames(className, { open: isOpen })}
    >
      {renderToggle({
        'aria-expanded': isOpen,
        'aria-haspopup': true,
        onClick: handleToggleElementClick,
      })}
      {isOpen && <ul className="dropdown-menu">{children({ closeMenu })}</ul>}
    </AsPolymorph>
  );
}

TabbableNavDropdown.propTypes = {
  renderToggle: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default TabbableNavDropdown;
