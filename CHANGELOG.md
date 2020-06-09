# Unreleased
  **MINOR CHANGES**
  - Fix fixed prices always being zero
  
  **CHANGELOG**
  - Added font size control

# 0.10.0
  **MINOR CHANGES**
  - Fixed refund policy test being visible to regular users
  - Fixed enabled edit button for paid reservations when the user does not have admin level privileges
  - Updated refund policy related descriptions
  - Changed billing email to be shown in reservation confirmation view

# 0.10.0
  **MINOR CHANGES**
  - Changed search count to be announced when a search is made
  - Changed search results sort order to be announced when sort order is changed
  - Fixed illegible icon names in toggles being read out loud by screen readers
  - Fixed missing line breaks in generic terms and specific terms
  - Changed approve and deny buttons to be hidden when irrelevant in the manage reservations view
  - Fixed translation error in the English version that caused confusion when approving reservations
  - Fixed resource page sometimes being scrolled to its end after it had been opened
  - Fixed missing results in search results
  - Fixed scrollbar flickering in reservation calendar when business hours were of short duration
  - Fixed premise dropdown returning empty labels
  - Fixed resource calendar not rendering anything when closing time was 23:00 or later
  - Changed calendar to be disabled when the user doesn't have privileges to make reservations to the resource

  **CHANGELOG**
  - [#1118](https://github.com/City-of-Helsinki/varaamo/pull/1118) Added support for unit manager role; unit managers now have the same permissions as unit admins do
  - [#1125](https://github.com/City-of-Helsinki/varaamo/pull/1125) Added support for unit viewer role; unit viewers are allowed to complete the same actions as unit admins or unit managers in the UI, but Respa may block some requests for users with this role
  - [#1127](https://github.com/City-of-Helsinki/varaamo/pull/1127) Added support for resource payment terms
  - [#1126](https://github.com/City-of-Helsinki/varaamo/pull/1126) Fixed my reservation crashing on some devices and improved performance
  - [#1131](https://github.com/City-of-Helsinki/varaamo/pull/1131) Changed labelling for event name field to distinct it as public instead of private
  - [#1137](https://github.com/City-of-Helsinki/varaamo/pull/1137) Added support for daily, weekly and fixed resource prices
  - [#1138](https://github.com/City-of-Helsinki/varaamo/pull/1138) Added support for longer slot sizes

# 0.9.0
  **MINOR CHANGES**
  - Changed `eslint` rules to require comma dangle
  - Added `eslint-plugin-react-hooks`
  - Changed language and sign out menus to be navigable with tab instead of arrow keys
  - HTML's `lang` attribute is now synchronized with currently selected language
  - Fixed illogical tab order on mobile version of main menu
  - Added a skip to content link for screen reader and keyboard users
  - Changed date control on the search page to allow date to be written in an input

  **CHANGELOG**
  - [#1095](https://github.com/City-of-Helsinki/varaamo/pull/1095) Display extra question field on reservation form
  - [#1096](https://github.com/City-of-Helsinki/varaamo/pull/1096) Added ResourcePanel for genericTerms. Added react-autosize-textarea for reservationExtraQuestions.
  - [#1098](https://github.com/City-of-Helsinki/varaamo/pull/1098) Added user notificator system.
  - [#1099](https://github.com/City-of-Helsinki/varaamo/pull/1099) Changed into using runtime environment
  - [#1106](https://github.com/City-of-Helsinki/varaamo/pull/1106) Fixed searches only targeting current date
  - [#1110](https://github.com/City-of-Helsinki/varaamo/pull/1110) Fixed price being displayed for resources that don't support online payment

# 0.8.1
  **MINOR CHANGES**
  - Fixed bug in reservation details where under "Reservation must be made xx days in advance" actually displays data from "Reservations can be made a xxx in advance".
  - Staff no longer needs to fill all mandatory metadata fields.
  - Sort by select box has enough clearance so it won't disappear behind footer if there are no search results.
  - Search page time range is always visible.
  - Added today buttons and functionality to search page and my premises. 
  
  **CHANGELOG**
  - [#1087](https://github.com/City-of-Helsinki/varaamo/pull/1087) Navigation will bring user back to correct page when editing reservation. During edit form values are filled with existing data.
  - [#1088](https://github.com/City-of-Helsinki/varaamo/pull/1088) Sort by on search page has enough space so it won't disappear under footer. TimeRangeFilter selects are always show, but disabled if not toggled.
  - [#1089](https://github.com/City-of-Helsinki/varaamo/pull/1089) Added today buttons to search and my premises pages.
  - [#1091](https://github.com/City-of-Helsinki/varaamo/pull/1091) Increased time period for getting resources opening hours. Added text that shows how far in the future user can make a reservation.
  - [#1092](https://github.com/City-of-Helsinki/varaamo/pull/1092) Removed all mandatory fields is isStaff is true, except eventDescription & reserverName.

# 0.8.0
  **MINOR CHANGES**
  - Reordered info blocks on ResourcePage
  - Added colored explanations for fullCalendar events.
  - Brought back missing billingFirstName, billingLastName, billingPhoneNumber and billingEmailAddress.
  - Changed Terms of Service and Payment of Service modals to text box. Moved resource specific terms before buttons.
  - Fixed issue where eventDescription was set to required instead of eventSubject when making reservation as admin.
  - My premises slot sizes match are now determined by resource. Events with price have different color and show little price tag.
  - My premises shows units name and are now sorted based on that.
  - If event is billable, information modal shows payers name and email. Also price and cancel directions for staff are shown. Cancel confirmation modal has extra step for confirming that user has read cancel directions.
  - Removed admin utilities from Your reservations page. Future and past reservations are shown below titles and page is now paginated.
  - Your premise list items have label for payment state and show price that was paid. If user is not admin modify button is disabled and cancel button shows modal with directions.
  - Fixed some finnish translations on Manage reservations page. Total number of reservations is also shown.
  - Cancel buttons in Manage reservations have extra confirmation dialog.  

  **CHANGELOG**
  - [#1070](https://github.com/City-of-Helsinki/varaamo/pull/1070) Add first name last name email phone number to payment form
  - [#1071](https://github.com/City-of-Helsinki/varaamo/pull/1071) Edited My premise event styles and added payment status labels for ReservationInfoModal
  - [#1072](https://github.com/City-of-Helsinki/varaamo/pull/1072) Added Payment state labels & total price for User reservations list. Disabled edit button for end user if reservation is billable.
  - [#1073](https://github.com/City-of-Helsinki/varaamo/pull/1073) My premises now gets slotSize from resource.
  - [#1074](https://github.com/City-of-Helsinki/varaamo/pull/1074) Changed payment and resource terms of service to text boxes.
  - [#1075](https://github.com/City-of-Helsinki/varaamo/pull/1075) Added premise name text and sorted resources based on that (in My premises page).
  - [#1076](https://github.com/City-of-Helsinki/varaamo/pull/1076) Added little colored boxes with texts to explain calendar event colors.
  - [#1077](https://github.com/City-of-Helsinki/varaamo/pull/1077) Changed some finnish translations. ReservationInformationForm now shows right helper text based on resource type.
  - [#1078](https://github.com/City-of-Helsinki/varaamo/pull/1078) Users are now able to see their past reservations. User reservations page also paginates results.
  - [#1079](https://github.com/City-of-Helsinki/varaamo/pull/1079) Cancel modal changes in app and scr.
  - [#1080](https://github.com/City-of-Helsinki/varaamo/pull/1080) Fixed problem where wrong field was required when making reservation as admin.
  - [#1081](https://github.com/City-of-Helsinki/varaamo/pull/1081) Added payer name and email into My premises and Manage reservations info modals. Manage reservations page also shows total amount of search results.
  - [#1082](https://github.com/City-of-Helsinki/varaamo/pull/1082) Switched resource specificTerms position on view.
  - [#1083](https://github.com/City-of-Helsinki/varaamo/pull/1083) Reordered info blocks on ResourcePage. Moved min period from "Reserve" to "Reservation information".

# 0.7.0
  **MINOR CHANGES**
  - Added event close and staff event checkboxes for staff in reservation form / resource page
  - FullCalendar mobile version usability improvements.
  - Reverted old notifications.
  - Updated front page icons.
  - Overall minor UI layout changes / fixes.
  - Fixed edit reservation page
  - Fixed staff reservation management approve/deny buttons
  - Fixed staff permissions in resource page, my premise

  **CHANGELOG**
  - [#1052](https://github.com/City-of-Helsinki/varaamo/pull/1052) Add internal field for staff in ReservationForm.
  - [#1058](https://github.com/City-of-Helsinki/varaamo/pull/1058) Renamed internal fields for staff in ReservationForm.
  - [#1059](https://github.com/City-of-Helsinki/varaamo/pull/1059) Removed DatePicker arrows, styled fullCalendar buttons.
  - [#1060](https://github.com/City-of-Helsinki/varaamo/pull/1060) Removed unnecessary scrollbars and replaced URL with word.
  - [#1061](https://github.com/City-of-Helsinki/varaamo/pull/1061) FullCalendar arrows change date and is better connected to DatePicker.
  - [#1062](https://github.com/City-of-Helsinki/varaamo/pull/1062) Old notifications are reverted back to app folder.
  - [#1063](https://github.com/City-of-Helsinki/varaamo/pull/1063) Increased timepicker z-index value.
  - [#1064](https://github.com/City-of-Helsinki/varaamo/pull/1064) Replaced ? with & in Feedback URL. 
  - [#1065](https://github.com/City-of-Helsinki/varaamo/pull/1065) Replaced some frontpage icons.
  - [#1066](https://github.com/City-of-Helsinki/varaamo/pull/1066) Minor change in ReservationInformationModal reservation data structure.
  - [#1067](https://github.com/City-of-Helsinki/varaamo/pull/1067) FullCalendar mobile improvements and styling changes.
  
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
