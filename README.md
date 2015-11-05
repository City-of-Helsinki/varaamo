Respa-ui
========

[![Circle CI](https://circleci.com/gh/fastmonkeys/respa-ui.svg?style=svg)](https://circleci.com/gh/fastmonkeys/respa-ui)

UI for a resource reservation system built for city of Helsinki. Uses the [respa API](http://api.hel.fi/respa/v1/).

Requirements
------------

- [node](http://nodejs.org/) `^0.12.7`
- [npm](https://www.npmjs.com/) `^2.11.3`

Architecture
------------

- [Redux](https://github.com/rackt/redux) handles the state management of the app. For more info check their awesome [docs](http://rackt.org/redux/index.html).
- [React](https://facebook.github.io/react/) handles the rendering of the 'views'.
- [react-redux](https://github.com/rackt/react-redux) is used to connect the Redux Store to React components.
- [react-router](https://github.com/rackt/react-router) handles the routing of the app.
- [reselect](https://github.com/rackt/reselect) is used for getting data from Redux Store and manipulating it to be better usable in React components.
- [redux-api-middleware](https://github.com/agraboso/redux-api-middleware) is used to interact with the API.
- The application is run on an [express](http://expressjs.com/) server.
- [webpack](https://webpack.github.io/) takes modules with dependencies and generates static assets representing those modules.
- [Babel](https://babeljs.io/) transforms JavaScript written in ES2015 and JSX syntax to regular JavaScript.

Usage
-----

### Starting development server

Follow the instructions below to set up the development environment.
By default the running app can be found at `localhost:3000`.

1. Install npm dependencies:

    ```
    $ npm install
    ```

2. Then, start the development server:

    ```
    $ npm start
    ```

### Starting production server

Follow the instructions below to build and start production server.
By default the running app uses port `8080`.

1. Install npm dependencies:

    ```
    $ npm install
    ```

2. Build the production bundle:

    ```
    $ npm run build
    ```

3. Then, start the production server:

    ```
    $ npm run start:production
    ```

### Running tests

- Running unit tests:

    ```
    $ npm test
    ```

- Running tests on watch mode:

    ```
    $ npm run test:watch
    ```

- Running tests with code coverage:

    ```
    $ npm run test:coverage
    ```
