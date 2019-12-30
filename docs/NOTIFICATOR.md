User notificator
===============  

User notificator is component that allows you to send notification messages to specific user role (user or staff) or to all users. Notifications will be show in the similar fashion as "This is the test version of Varaamo" 
shown in [here](https://varaamo.test.hel.ninja/).
Notificator is using Google's Firebase instead of Respa API. To create and setup a Firebase project you can follow the provided written [guide](https://github.com/City-of-Helsinki/varaamo/blob/development/docs/FIREBASE.md).  
Add your Firebase API keys corresponding variables in `.env`. (Firebase related variables are show in updated [env.example](https://github.com/City-of-Helsinki/varaamo/blob/develop/.env.example) file.)

When user closes notification, notification ID is stored in cookies and will be show again only if cookies are cleared.  
To create user notifications, enter `/create-notifations` to URL and log in with credentials you created while setting up your Firebase project.  

**Create new notification fields**
- Name: This is only used in notifications list, can be empty.
- Target: Determines who will see the notification. `All`-status has priority over the other two.
- Urgency: Determines background color for the notification
- Until: Last day that the notification will be shown.
- `</a>` and `<b>` buttons: Shortcuts for adding html tags to message. 
- FI, EN, SV: You can write your message in three different languages. Shown message is based on users selected language.

**Notifications list**  
- Created notifications can be edited
- While editing, notification can be hidden immediately by changing active status to False.






