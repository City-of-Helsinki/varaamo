Create firebase project
=======================

This guide covers all necessary steps to create and setup Google Firebase project.  
NOTE: It's good idea to create two projects, one for development & testing and other one for production.

- Start by navigating to [Firebase console](https://console.firebase.google.com/u/2/?hl=en)
and log in with google account. Next press "Create a project button", this will start project creation process.  
Enter name for your project e.g "notificator" and continue. In next step it's possible to disable Google analytics if you want, but it's recommended to leave them enabled.  
(You can read more about Google analytics [here](https://developers.google.com/analytics/devguides/platform))  
In last step change analytics location to Finland and accept all the terms of services.

- After the project is created you need to create an app. This can be done by selecting "Web" below "Get started by adding Firebase to your app" heading.  
If for some reason text and buttons are not showing press little settings wheel next to Project Overview on the left navigation menu and select Project settings.  
(This is also the place where you can find API keys after the app is created)  
Enter a nickname for your app and press "Register app". Grab your API keys and return to console.

- Database creation is up next. Press "Develop" on the left navigation and select Database. Press "Create database" button below "Cloud Firestore" heading.  
Leave "Start in production mode" selected and continue. Change "Cloud Firestore location" to eur3(europe-west) and press Done.   
After Google is done creating database you are taken to "Database view". In the future this is the place where you can create, search, edit and delete saved data.
Next click "Rules" tab below "Database" heading and copy paste the following to editor you see on the page.

```
rules_version = '2';
 service cloud.firestore {
   match /databases/{database}/documents {
 
     function isAuthenticated() {
   		return request.auth != null;
 		}
     
     match /notifications/{notificationId} {
     	allow read;
       allow write: if isAuthenticated();
     }  
   }
 }
 ```
- Press "Publish" button or control + s to save changes.  
In short: Varaamo's notificator is set to write everything to "notifications" collection, these rules allow everyone to read stored data but only by logging in   
and authenticating user is allowed to write changes to database. It's just an extra layer of protection to avoid miss use.

- Because only authenticated users are allowed to write changes, you need to add authentication to the project. Press "Develop" on the left navigation and select Authentication.
Press "Set up sign-in-method" and hover over Email/Password and click the pencil button that appears on the right. Enable the first toggle button and save.
Select "Users" tab under "Authentication" heading and add user. Enter email and password and press "Add user". With these credentials you can now log in to Varaamo's
create-notifications portal.   
NOTE: It's recommended that you only toggle Email/Password sign-in method, with this you can control who is able to log in and send notifications. By toggling e.g Google, everyone with Google account could log in and start sending notifications.

Follow the same steps to create another project for production build. Just FYI, just adding another app to project won't be enough because changes are still saved to same database.
