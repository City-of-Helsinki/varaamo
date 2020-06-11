import React from 'react';

function elementContains(element, contained) {
  return element && contained instanceof Node && element.contains(contained);
}

function useDropdownDocumentEvents(dropdown, setIsMenuVisible) {
  const isComponentFocused = React.useCallback(() => {
    const active = document.activeElement;
    const current = dropdown && dropdown.current;

    if (elementContains(current, active)) {
      return true;
    }
    return false;
  }, [dropdown]);

  const handleDocumentClick = React.useCallback(
    (event) => {
      const { target } = event;
      const current = dropdown && dropdown.current;

      if (!elementContains(current, target)) {
        setIsMenuVisible(false);
      }
    },
    [dropdown, setIsMenuVisible]
  );

  const handleDocumentFocusin = React.useCallback(
    (event) => {
      const { target } = event;
      const current = dropdown && dropdown.current;

      if (!elementContains(current, target)) {
        setIsMenuVisible(false);
      }
    },
    [dropdown, setIsMenuVisible]
  );

  const handleDocumentKeyDown = React.useCallback(
    (event) => {
      if (!isComponentFocused()) return;

      switch (event.key) {
        case 'Escape':
          setIsMenuVisible(false);
          break;
        default:
          break;
      }
    },
    [isComponentFocused, setIsMenuVisible]
  );

  const setUp = React.useCallback(() => {
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('focusin', handleDocumentFocusin);
    document.addEventListener('keydown', handleDocumentKeyDown);
  }, [handleDocumentClick, handleDocumentFocusin, handleDocumentKeyDown]);

  const tearDown = React.useCallback(() => {
    document.removeEventListener('click', handleDocumentClick);
    document.removeEventListener('focusin', handleDocumentFocusin);
    document.removeEventListener('keydown', handleDocumentKeyDown);
  }, [handleDocumentClick, handleDocumentFocusin, handleDocumentKeyDown]);

  return [setUp, tearDown];
}

export default useDropdownDocumentEvents;
