import React, { PropTypes } from 'react';
import classnames from 'classnames';
import ReactSidebar from 'react-sidebar';

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  docked: PropTypes.bool,
  onSetOpen: PropTypes.func,
  open: PropTypes.bool.isRequired,
  sidebar: PropTypes.node.isRequired,
};

Sidebar.defaultProps = {
  docked: false,
};

const styles = {
  sidebar: {
    width: '100vw',
    maxWidth: '400px',
    zIndex: 20001,
  },
  overlay: {
    zIndex: 20000,
  },
  dragHandle: {
    zIndex: 20000,
  },
};

function Sidebar({ children, className, docked, onSetOpen, open, sidebar }) {
  return (
    <div className={classnames('app-Sidebar', className)} >
      <ReactSidebar
        contentClassName="app-Sidebar__content"
        docked={docked && open}
        onSetOpen={onSetOpen}
        open={open}
        pullRight
        sidebar={sidebar}
        sidebarClassName="app-Sidebar__sidebar"
        styles={styles}
        touch
      >
        {children}
      </ReactSidebar>
    </div>
  );
}

export default Sidebar;
