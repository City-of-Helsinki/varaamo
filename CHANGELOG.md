# 0.3.0
  **MAJOR CHANGES**
  ```
  - Add translation for date-picker, show date and month in currently selected language.

  - Set varaamo timezone to flexible base on user local timezone.

  - Add slotSize and minPeriod to reservation select, enable ability to reserve sauna slots with default amount of minPeriod. Time slot range equal with slotSize config from backend.

  - Show access-code pending text if the access-code is generated 24h before reservation starts.
  ```

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
    - Ability to favourite resources straight on search view instead going to resource detail page.

  **CHANGELOG**

  - [#895](https://github.com/City-of-Helsinki/varaamo/pull/895) Add sort to sort filtered resources.
  - [#904](https://github.com/City-of-Helsinki/varaamo/pull/904) Favourite Resource on search view.
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
