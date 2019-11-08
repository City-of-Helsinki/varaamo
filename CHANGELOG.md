# 0.7.0-pre
  **CHANGELOG**
  - [#1052](https://github.com/City-of-Helsinki/varaamo/pull/1052) Add internal field for staff in ReservationForm.
  - [#1058](https://github.com/City-of-Helsinki/varaamo/pull/1058) Renamed internal fields for staff in ReservationForm.
  - [#1059](https://github.com/City-of-Helsinki/varaamo/pull/1059) Removed DatePicker arrows, styled fullCalendar buttons.
  - [#1060](https://github.com/City-of-Helsinki/varaamo/pull/1060) Removed unnecessary scrollbars and replaced URL with word.
  
# 0.6.1
  **HOTFIX**
  - Resource fetchAll come with empty reservations data, affect resource availability status was determined wrong, which confuse user and display wrong status.
  - Reduce time range search list of resources to 1 day, single resource and single reservations to 2 months instead of 4 months.

  **CHANGELOG**
  - [#1044](https://github.com/City-of-Helsinki/varaamo/pull/1044) Populate resource fetching with default time range as 1 month.
  - [#1046](https://github.com/City-of-Helsinki/varaamo/pull/1046) Reduce Varaamo request size.
  - [#1048](https://github.com/City-of-Helsinki/varaamo/pull/1048) Reduce Varaamo request size.

# 0.6.0
  **MAJOR CHANGES**
  - Support for payments in Varaamo.
  - Add option to configure time zone of calendar/resources. Defaults to `Europe/Helsinki`.
  - Permission checking has been changed: We are now using unit authorizations instead of unit object permissions from respa admin.

  ***CALENDAR***
  - Add reusable FullCalendar component.
  - Fix FullCalendar not auto-select `min_period` time slot when user select. Various fixes related to edit reservation calendar, drag and drop and select error handler.
  - Fix missing `max_period` check when user select / resize calendar reservation. Show notification and revert to `max_period` if user select bigger amount of time slot than the limit. Various improvement for calendar is included as well.
  - Add custom mobile view and stylings in calendar.

  **MINOR CHANGES**
  - Replace failure message and add a return button for reservation payment.
  - Fix manage reservation page only display `can_approve` reservation, now display *all* reservations. Add strict rules for staff to be able to edit/cancel specific reservation.
  - Fix missing reservation metadata fields data in manage reservation view. Trim empty field row.
  - Add `show_only` filter section to filter reservation list. This filter have `can_modify` as its default value.
  - Anonymous users now see a log in button below the calendar on the resource page helping them understand that they need to log in to continue.
  - Errors from respa backend are not swallowed in our ApiClient anymore.
  - Allow user to select time slot which is already happening.

  **HOTFIX**
  - Fix resource information headlines and icon.
  - Fix default timezone being overrided and disappear from moment object by fullcalendar moment-timezone plugin.

  **CHANGELOG**
  - [#995](https://github.com/City-of-Helsinki/varaamo/pull/995) Fix resource information headlines and icon.
  - [#968](https://github.com/City-of-Helsinki/varaamo/pull/968) Support payments for Varaamo.
  - [#999](https://github.com/City-of-Helsinki/varaamo/pull/968) Add reusable FullCalendar component. Used in resource page.
  - [#1002](https://github.com/City-of-Helsinki/varaamo/pull/1002) Replace failure message and add a return button.
  - [#1004](https://github.com/City-of-Helsinki/varaamo/pull/1004) Staff cannot see normal reservations.
  - [#1005](https://github.com/City-of-Helsinki/varaamo/pull/1005) Reservation information modal is missing metadata fields.
  - [#1006](https://github.com/City-of-Helsinki/varaamo/pull/1006) Manage reservation filter buttons.
  - [#1026](https://github.com/City-of-Helsinki/varaamo/pull/1026) Add support for minPeriod auto-select.
  - [#1027](https://github.com/City-of-Helsinki/varaamo/pull/1027) Improve resource page usability for anonymous users.
  - [#1028](https://github.com/City-of-Helsinki/varaamo/pull/1028) Always fetch reservations with start and end filters.
  - [#1029](https://github.com/City-of-Helsinki/varaamo/pull/1029) Add option to configure time zone for resources.
  - [#1033](https://github.com/City-of-Helsinki/varaamo/pull/1033) Show errors to staff members if editing of reservations fail.
  - [#1031](https://github.com/City-of-Helsinki/varaamo/pull/1031) Use resource's userPermissions.isAdmin flag to check if user isStaff.
  - [#1032](https://github.com/City-of-Helsinki/varaamo/pull/1032) Better max period handling for FullCalendar.
  - [#1035](https://github.com/City-of-Helsinki/varaamo/pull/1035) Daily / weekly view for mobile.
  - [#1037](https://github.com/City-of-Helsinki/varaamo/pull/1037) Allow to select timeslot which is already happening.
  - [#1039](https://github.com/City-of-Helsinki/varaamo/pull/1039) Fix moment-timezone default timezone.

# 0.4.2
  **HOTFIX**
  - Fix various styling issue for date-picker [#991](https://github.com/City-of-Helsinki/varaamo/pull/991)
  - Add `isAdmin` check for RecurringReservationControl to normal user will not able to make recurring reservation. [#993](https://github.com/City-of-Helsinki/varaamo/pull/993/)


# 0.4.1
  **HOTFIX**
  - Fix security warnings for dependencies: react-select, jest, postcss-loader, codecov, node-sass, eslint

# 0.4.0
  **MAJOR CHANGES**
  - Add new purpose section for sauna and organize events. As well as mock placeholder icon.
  - Some technical improvements.

  **CHANGELOG**
  - [#940](https://github.com/City-of-Helsinki/varaamo/pull/940) Upgrade fortawesome, add new temp purpose icon.
  - [#939](https://github.com/City-of-Helsinki/varaamo/pull/939) Rename all classnames imports to classNames
  - [#934](https://github.com/City-of-Helsinki/varaamo/pull/934) New folder structure

# 0.3.0
  **MAJOR CHANGES**
  - Add translation for date-picker, show date and month in currently selected language.

  - Set varaamo timezone to flexible base on user local timezone.

  - Add slotSize and minPeriod to reservation select, enable ability to reserve sauna slots with default amount of minPeriod. Time slot range equal with slotSize config from backend.

  - Show access-code pending text if the access-code is generated 24h before reservation starts.

  **CHANGELOG**

  - [#920](https://github.com/City-of-Helsinki/varaamo/pull/920) Add translation for date-picker.
  - [#921](https://github.com/City-of-Helsinki/varaamo/pull/921) Set varaamo timezone to flexible base on user local timezone.
  - [#925](https://github.com/City-of-Helsinki/varaamo/pull/925) Add slotSize and minPeriod to reservation select, enable ability to reserve sauna with default amount of minPeriod.
  - [#932](https://github.com/City-of-Helsinki/varaamo/pull/932) Show access-code pending text if the access-code is generated 24h before reservation starts.

  - [#922](https://github.com/City-of-Helsinki/varaamo/pull/922) Add municipality options to env config.
  - [#924](https://github.com/City-of-Helsinki/varaamo/pull/924) Add municipality to clear filter list.
  - [#927](https://github.com/City-of-Helsinki/varaamo/pull/927) Translate SelectControl noOptionsMessage.
  - [#928](https://github.com/City-of-Helsinki/varaamo/pull/928), [#930](https://github.com/City-of-Helsinki/varaamo/pull/930), [#931](https://github.com/City-of-Helsinki/varaamo/pull/931) Bugfix for [#925](https://github.com/City-of-Helsinki/varaamo/pull/925)

# 0.2.0
  **MAJOR CHANGES**

    - Add new selection field to sort filtered resources. Currently support to search by name, type, premise, people.
    - Temporarily only show warning messages in 3 languages for IE11 user.
    - Ability to favorite resources straight on search view instead going to resource detail page.

  **CHANGELOG**

  - [#895](https://github.com/City-of-Helsinki/varaamo/pull/895) Add sort to sort filtered resources.
  - [#904](https://github.com/City-of-Helsinki/varaamo/pull/904) Favorite Resource on search view.
  - [#909](https://github.com/City-of-Helsinki/varaamo/pull/909) Show warning message for IE11 users.

# 0.1.1
  **HOTFIX**

  - [#913](https://github.com/City-of-Helsinki/varaamo/pull/913) Fix issue staff comment section is not working. Reason: React-bootstrap ref prop which is deprecated and replace with inputProps

# 0.1.0
  **MAJOR CHANGES**

    - Replacing Karma, Chai, Mocha with Jest.
    - Upgrading React, Webpack, Babel and dependencies to latest.
    - Dockerized development environment.
    - Remove low locked node version 6, require v8 for Babel 7.

  **CHANGELOG**

  **UI changes:**
  - [#863](https://github.com/City-of-Helsinki/varaamo/pull/863): Make homepage banner clickable.

  - [#865](https://github.com/City-of-Helsinki/varaamo/pull/865): Delayed reservation.

  - [#867](https://github.com/City-of-Helsinki/varaamo/pull/867): Add config to fetch all unit that doesn't have empty resources.

  - [#868](https://github.com/City-of-Helsinki/varaamo/pull/868): Add municipality filters for filtering resources base on municiples.

  - [#873](https://github.com/City-of-Helsinki/varaamo/pull/873): Limit the selection of time slots to the ones within max period.

  - [#875](https://github.com/City-of-Helsinki/varaamo/pull/875): Expand advanced search panel when filters are applied.

  - [#876](https://github.com/City-of-Helsinki/varaamo/pull/876): Free-of-charge filter for resources.

  - [#878](https://github.com/City-of-Helsinki/varaamo/pull/878): Remove the link for old website from the footer.

  - [#883](https://github.com/City-of-Helsinki/varaamo/pull/883): Clear all filters after reset.

  - [#889](https://github.com/City-of-Helsinki/varaamo/pull/889): Disable reservation time limit for admins.

  - [#899](https://github.com/City-of-Helsinki/varaamo/pull/899): Add unpublished tag to resource search list.

  - [#901](https://github.com/City-of-Helsinki/varaamo/pull/901): Add navigation links to staff and higher permission user.


  **Upgrading:**

  - [#854](https://github.com/City-of-Helsinki/varaamo/pull/854): Upgrade react-router to react-router v4.

  - [#856](https://github.com/City-of-Helsinki/varaamo/pull/856): Add dockerize config to dockerize development environment.

  - [#857](https://github.com/City-of-Helsinki/varaamo/pull/857): Upgrade moment, moment-range, moment-timezome.

  - [#860](https://github.com/City-of-Helsinki/varaamo/pull/860): Upgrade lodash.

  - [#862](https://github.com/City-of-Helsinki/varaamo/pull/862): Replace redux-logger with redux-devtools.

  - [#868](https://github.com/City-of-Helsinki/varaamo/pull/868): Upgrade react-select.

  - [#874](https://github.com/City-of-Helsinki/varaamo/pull/874): Replace React internal prop-types with npm prop-types.

  - [#879](https://github.com/City-of-Helsinki/varaamo/pull/879): Upgrade React to 15.6.2, Enzyme to v3+.

  - [#882](https://github.com/City-of-Helsinki/varaamo/pull/882): Upgrade react-day-picker, remove react-date-picker.

  - [#884](https://github.com/City-of-Helsinki/varaamo/pull/884): Upgrade babel to v7, webpack v4, replace Karma/Mocha/Chai with Jest.

  - [#890](https://github.com/City-of-Helsinki/varaamo/pull/890): Replace Chai with Jest's assertions.

  - [#892](https://github.com/City-of-Helsinki/varaamo/pull/892): Remove unnecessary outdated dependencies:

      - Remove react-document-title, use react-helmet
      - Remove react-body-classname, classname append can be handled by classnames

  - [#893](https://github.com/City-of-Helsinki/varaamo/pull/893): Remove unnessary persisted state library, upgrade redux and dependencies:

      - Remove redux-localstorage and redux-localstorage-filter. Replaced with vanilla code.

      - Upgrade redux and dependencies.

  - [#894](https://github.com/City-of-Helsinki/varaamo/pull/894): Upgrade React to 16.8.x:

      - Upgrade React to 16.8.x
      - Upgrade React's dependencies to latest.

  - [#900](https://github.com/City-of-Helsinki/varaamo/pull/900): Clean up obsolete/deprecated component.

      - Delete navbar, sidebar, side-navbar which was replaced by new component but not getting removed.
