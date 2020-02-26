# Permission system

Unfortunately this is not a complete description of the permission system--you'll need to get your hands dirty to fully figure it out. I hope that these docs help you get started. To represent this fact, I am adopting a less official tone for this documentation.

Permission management for the combination of Varaamo and Respa happens in multiple places with varying approaches. Some rules are explicit, some are implicit, some are documented and some are harder to come by.

Please extend this documentation when you face problems. I'll write down the points of confusion I faced. I hope that this information can be helpful for later developers in resolving theirs--but I make no promises of completeness nor total correctness.

## Permissions in Respa

When in doubt, your best bet is to go through Respa's source code. The model declaration files will contain most of the permission checks you care about, or they'll at least point you to the place where you can find them.

Respa uses a combination of roles and permission to allow and disallow user actions. You can find the documentation for Respa's permissions here: https://github.com/City-of-Helsinki/respa/blob/develop/docs/permissions.rst

A user can have a role that describes their status within the whole system or within a unit. The unit role is used to describe the user's permissions for both the `reservation` and `resource` objects. Currently Varaamo mostly relies on the `is_staff` flag found from the `user` object as well as the `user_permissions` object found from among the fields of `reservation` and `resource`.

If you read through the documentation you may get a sense that it's geared more towards interoperability between Respa and the admin UI than Respa and Varaamo. That's why, although you can use the documentation as a lead, you can't necessarily use it to solve all of the questions you face.

When I developed the permission system, I mostly did it for `resource` objects. Another important part of the puzzle is the `reservation` object, but I personally only have a limited visibility into that.

### Mixed implicit and explicit permissions
A source of possible danger when it comes to `resource` permissions is that some of them are explicit while some others are not. If you check the `user_permission` object that Respa returns, you'll notice that it has a composition along these lines of:

```js
{
  is_admin: false,
  is_manager: true,
  is_viewer: false,
  can_make_reservations: true,
  can_ignore_opening_hours: true,
  ...,
}
```

Here `can_make_reservations` and `can_ignore_opening_hours` are explicitly stated. On top of these permissions, "meta" (or implicit) permissions also exist. The user receives these based on their unit role. For instance, at one point, the following list was documented within the Respa repository in the permission docs linked previously:

```js
[
  'can_make_reservations',
  'can_modify_reservations',
  'can_ignore_opening_hours',
  'can_view_reservation_access_code',
  'can_view_reservation_extra_fields',
  'can_view_reservation_user',
  'can_access_reservation_comments',
  'can_comment_reservations',
  'can_view_reservation_catering_orders',
  'can_bypass_payment',
]
```

This architecture forces us to use the permissions system in two ways. We can deduce some permissions directly from the API response. And some permissions we need to deduce based on the role. For the latter case, to make the code maintainable, we need to maintain a role matrix within the Varaamo repository. With this approach, compared to using permissions directly from the API, we are disconnecting the permission business logic from its source.

### Possibilities for permission clashes
The permission system is not guaranteed to be completely transparent. I am aware of two instance where its possible to to arrive at an application state where role permissions are limited "unexpectedly". These cases you are able to deduce by reading the Respa source code.

**Unit viewer does not have modification permission when resource is not reservable**  
The unit viewer has the permission `can_modify_reservations`, but this does not apply when the `resource` the has the `reservable` flag set as `false`. From an API consumer perspective this might be hard to spot.

**Unit viewer does not have commenting permission when mandatory fields are missing from a `reservation`**  
The unit viewer has the permission `can_comment_reservations`, but it's possible to get the `reservation` into a state where the `viewer` is not able to modify the `reservation` at all.

Here's a case for reproduction:
1) Create a new reservation into as a unit admin, ignore billing information
2) Log out
3) Sign in as resource's unit viewer
4) Go into My Premises
5) Open the reservation you created during step 1
6) Add a comment

Commenting is just a `PUT` call into the `reservation` resource and as such expects the entire `reservation` object.

Because unit `admin` is able to ignore fields the unit `viewer` is not, editing becomes impossible for the viewer until someone fills out the billing information for the `reservation`. 

## Permissions in Varaamo
Permissions within Varaamo are still mainly controlled with `selectors`. Some permissions are managed by interpreting API responses directly. I also developed a function that allows to check whether a role has permission(s) for an action.

### Permissions with Selectors
At the time of writing this document, the file `authSelectors`<sup>1</sup> contained the most commonly used selectors for permission management.

**`isAdminSelector`**  
As you can probably decipher from the content of this selector, it actually checks whether the user is staff _within the entire Respa system_. If you go and check the Respa permission document, under [Implementation of the Roles](https://github.com/City-of-Helsinki/respa/blob/develop/docs/permissions.rst#implementation-of-the-roles) section, you'll find the following:

>All users having any of these Super User, Administrator or Manager statuses are considered "staff" and should have the is_staff property of the User object set to True.

This means that a user with a unit `manager` role for any unit, is considered to be "staff" within the entire Respa system.

```js
const isAdminSelector = createSelector(
  currentUserSelector,
  currentUser => Boolean(currentUser.isStaff),
);
```

There's a naming collision here, because the name implies admin within Varaamo, but it actually communicates staff status. One way to make sense of it is to think it like this: from Varaamo's perspective staff users are admin users. _But_ permissions do vary between the roles that receive the staff label. That's why we need more fine grained control.

**`createIsStaffSelector`**  
So here we are using the staff name, but we are still lacking some clarity. On the surface this function seems to be eerily similar with the one we just introduced: it's checking whether the user has a set of roles for a unit, and if so, communicates that they are staff.

```js
function createIsStaffSelector(resourceSelector) {
  return createSelector(
    createIsUnitAdminSelector(resourceSelector),
    createIsUnitManagerSelector(resourceSelector),
    createIsUnitViewerSelector(resourceSelector),
    (isUnitAdmin, isUnitManager, isUnitViewer) => isUnitAdmin || isUnitManager || isUnitViewer,
  );
}
```

The difference, you might be able to spot when you read the function, is that this staff status is `resource` specific. With this selector you are able to ask "is the current user staff for this resource".

NOTE
* This concept of "unit staff" does not exist in Respa. Instead it's a concept we use in Varaamo to allow "staff" users to complete "staff" specific actions.
* Unit `admin` and unit `manager` should be able to complete exactly the same actions within Varaamo--but unit `viewer` has some further limitations. _All of these are not currently addressed in Varaamo_. Instead, Varaamo allows the viewer user to make requests they do not have permission to complete and will then rely on the error handling logic within the application to let the user know that their action failed.

### Permissions with Other Means

**Relying on API**  
The API returns a `userPermission` object within the fields of for instance `resource` and `reservation`. At certain points of the application, this object is used directly to check user permissions. This approach avoids data model transformations, it avoids replicating the permission matrix and it lessens the need for scaffolding. By and large it seems like a neat approach for managing permissions.

**`hasPermissionForResource`**  
This is an utility function I developed to help myself when implementing the unit `viewer` role. To learn a bit more about the context for introducing this utility you can read through [#1125](https://github.com/City-of-Helsinki/varaamo/pull/1125).

In short, originally the unit viewer had a more limited set of permissions. To address those, I needed a way to check permissions with finer control. Previously the app had relied on a boolean flag for roles. Retaining the approach would have resulted in prop drilling. I could have changed these boolean flags into role strings, but I decided to dwell deeper.

Checking permissions instead of roles is nice because it makes the permission system extendable and modifiable. If we add a new role we can rely on the same permission checks, and if role permissions are modified we can just modify them in our single source of truth. The more convoluted cases, such as adding or changing permissions, have a great chance of being no more convoluted than they are when checking against a role directly.

```js
const canComment = hasPermissionForResource(
  userUnitRole,
  resourcePermissionTypes.CAN_COMMENT_RESERVATIONS
);
```

`hasPermissionForResource` takes in a unit `role` and a `permission` or a list of `permissions`. Both valid roles and permission have been defined in resource permission constants<sup>2</sup>. This file also holds the permission matrix that is used to decipher what permission each role has.

I added a helper selector into `authSelectors` called `createUserUnitRoleSelector`. You can use this selector to get a `hasPermissionForResource` compatible user unit role from a resource. In essence it transforms the role flags (`is_admin`, `is_manager`, ...) into string values (`resourceRoles.UNIT_ADMIN`, ...).

---

<sup>1</sup> `app/state/selectors/authSelectors.js`

<sup>2</sup> `src/domain/resource/permissions/constants.js`

