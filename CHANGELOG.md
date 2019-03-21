* 0.1.0
    ** MAJOR CHANGES **

    - Replacing Karma, Chai, Mocha with Jest.
    - Upgrading React, Webpack, Babel and dependencies to latest.
    - Dockerized development environment.
    - Remove low locked node version 6, require v8 for Babel 7.

    ** CHANGELOG **

    UI changes:
    - #863: Make homepage banner clickable.

    - #865: Delayed reservation.

    - #867: Add config to fetch all unit that doesn't have empty resources.

    - #868: Add municipality filters for filtering resources base on municiples.

    - #873: Limit the selection of time slots to the ones within max period.

    - #875: Expand advanced search panel when filters are applied.

    - #876: Free-of-charge filter for resources. 

    - #878: Remove the link for old website from the footer.

    - #883: Clear all filters after reset.

    - #889: Disable reservation time limit for admins.

    - #899: Add unpublished tag to resource search list.

    - #901: Add navigation links to staff and higher permission user.


    Upgrading:
    - #854: Upgrade react-router to react-router v4.

    - #856: Add dockerize config to dockerize development environment.

    - #857: Upgrade moment, moment-range, moment-timezome.

    - #860: Upgrade lodash.

    - #862: Replace redux-logger with redux-devtools.

    - #868: Upgrade react-select.

    - #874: Replace React internal prop-types with npm prop-types.

    - #879: Upgrade React to 15.6.2, Enzyme to v3+.

    - #882: Upgrade react-day-picker, remove react-date-picker.

    - #884: Upgrade babel to v7, webpack v4, replace Karma/Mocha/Chai with Jest.

    - #890: Replace Chai with Jest's assertions.

    - #892: Remove unnecessary outdated dependencies:

        - Remove react-document-title, use react-helmet
        - Remove react-body-classname, classname append can be handled by classnames

    - #893: Remove unnessary persisted state library, upgrade redux and dependencies:

        - Remove redux-localstorage and redux-localstorage-filter. Replaced with vanilla code.

        - Upgrade redux and dependencies.

    - #894: Upgrade React to 16.8.x:

        - Upgrade React to 16.8.x
        - Upgrade React's dependencies to latest.

    - #900: Clean up obsolete/deprecated component.

        - Delete navbar, sidebar, side-navbar which was replaced by new component but not getting removed.
