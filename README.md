Varaamo
=======

[![Circle CI](https://circleci.com/gh/City-of-Helsinki/varaamo.svg?style=svg)](https://circleci.com/gh/City-of-Helsinki/varaamo)

User interface for the City of Helsinki [varaamo.hel.fi](https://varaamo.hel.fi/) resource reservation service. Uses the [respa API](http://api.hel.fi/respa/v1/).

Requirements
------------

- [node](http://nodejs.org/) `6.5.0`
- [npm](https://www.npmjs.com/) `3.10.3`

Architecture
------------

- [Redux](https://github.com/reactjs/redux) handles the state management of the app. For more info check their awesome [docs](http://redux.js.org/).
- [React](https://facebook.github.io/react/) handles the rendering of the 'views'.
- [react-redux](https://github.com/reactjs/react-redux) is used to connect the Redux Store to React components.
- [react-router](https://github.com/ReactTraining/react-router) handles the routing of the app.
- [reselect](https://github.com/reactjs/reselect) is used for getting data from Redux Store and manipulating it to be better usable in React components.
- [redux-api-middleware](https://github.com/agraboso/redux-api-middleware) is used to interact with the API.
- The application is run on an [express](http://expressjs.com/) server.
- Uses [Passport](https://github.com/jaredhanson/passport) and [Passport-Helsinki](https://github.com/City-of-Helsinki/passport-helsinki) for authentication.
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

2. Make sure you have the following env variables set in an .env file in the root of the project:

    ```
    API_URL
    CLIENT_ID
    CLIENT_SECRET
    SESSION_SECRET
    TARGET_APP
    ```

3. Then, start the development server:

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

3. Make sure you have the required env variables set.

4. Then, start the production server:

    ```
    $ npm run start:production
    ```

### Running tests

- Run tests:

    ```
    $ npm test
    ```

- Run tests in watch mode:

    ```
    $ npm run test:watch
    ```

- Run tests with coverage:

    ```
    $ npm run test:coverage
    ```

### Running code linter

- To check the code for linting errors:

    ```
    $ npm run lint
    ```

Code style and linting
----------------------

The code mostly follows the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
All JavaScript should be written in ES2015 syntax.
Code is automatically linted with [eslint](http://eslint.org/) when running unit tests or bundling the app with webpack.

Styles and Stylesheets
----------------------

[Less](http://lesscss.org/) CSS pre-processor is used to make writing styles nicer. [Autoprefixer](https://github.com/postcss/autoprefixer) handles CSS vendor prefixes.
[Bootstrap](http://getbootstrap.com/) is used as the CSS framework for the site and [City of Helsinki Bootstrap theme](http://terotic.github.io/bootstrap-hel-fi/) is used as the main theme.

Testing framework
-----------------

- [Karma](http://karma-runner.github.io/0.13/index.html) is used to run the tests. On local machines tests are run on [PhantomJS](http://phantomjs.org/) to make running tests in watch mode as smooth as possible. On CI the tests are run on Chrome.
- [Mocha](https://mochajs.org/) is used as the test framework.
- [Chai](http://chaijs.com/) is used for test assertions.
- [simple-mock](https://github.com/jupiter/simple-mock) and [MockDate](https://github.com/boblauer/MockDate) are used for mocking and spies.
- [Enzyme](https://github.com/airbnb/enzyme) is used to make testing React Components easier.

License
-------

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 City of Helsinki <[http://www.hel.fi/](http://www.hel.fi/)>
