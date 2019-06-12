Varaamo
=======

[![Build status](https://travis-ci.org/City-of-Helsinki/varaamo.svg?branch=develop)](https://travis-ci.org/City-of-Helsinki/varaamo)
[![codecov](https://codecov.io/gh/City-of-Helsinki/varaamo/branch/develop/graph/badge.svg)](https://codecov.io/gh/City-of-Helsinki/varaamo)

User interface for the City of Helsinki [varaamo.hel.fi](https://varaamo.hel.fi/) resource reservation service. Uses the [respa API](http://api.hel.fi/respa/v1/).

Recommended requirements
------------

- [node](http://nodejs.org/) `>=8.15.1` | Suggestion: `10.15.1`
- [npm](https://www.npmjs.com/) `>=6.4.1` | Suggestion: `6.4.1`
- [yarn](https://yarnpkg.com/) Optional, if `yarn` is not included as part of your current node version. `npm` can be used.

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

### Starting dockerized development server

1. Check if Docker and docker CLI installed, port `3000` is free, not occupied by running server.

2. Make sure you have env variables in `.env`, otherwise extend it from example by:
    ```
    $ cp .env.example .env
    ```
3. Start building docker image and start container:
    ```
    $ docker-compose up
    ```
4. Open `localhost:3000` on browser when Webpack bundling is ready.

### Starting local development server

Follow the instructions below to set up the development environment.
By default the running app can be found at `localhost:3000`.

1. Install npm dependencies:

    ```
    $ yarn install
    ```

2. Make sure you have the following env variables set in an .env file in the root of the project:
    Run command:
    ```
    $ cp .env.example .env
    ```

    OR prepare .env with default content:

    ```
    CLIENT_ID
    CLIENT_SECRET
    SESSION_SECRET
    TARGET_APP
    API_URL
    CUSTOM_MUNICIPALITY_OPTIONS
    ```

    Environment's variable guideline:

    - `API_URL`:
      Custom config to replace global application's api URL. Expected value is valid URL string.

    - `CUSTOM_MUNICIPALITY_OPTIONS`:
      Config for custom municipalities. Expected value should be array of cities: `['Tampere','Jyväskylä','Oulu']`.

      Without this config, default to use 3 central cities Helsinki, Espoo, Vantaa as options.


3. Then, start the development server:

    ```
    $ yarn start
    ```

### Starting production server

Follow the instructions below to build and start production server.
By default the running app uses port `8080`.

1. Install npm dependencies:

    ```
    $ yarn install
    ```

2. Build the production bundle:

    ```
    $ yarn build
    ```

3. Make sure you have the required env variables set.

4. Then, start the production server:

    ```
    $ yarn start:production
    ```

### Running tests

- Run tests:

    ```
    $ yarn test
    ```

- Run tests in watch mode:

    ```
    $ yarn test:watch
    ```

- Run tests with coverage:

    ```
    $ yarn test:coverage
    ```

### Running code linter

- To check the code for linting errors:

    ```
    $ yarn lint
    ```
- To automate fixing lint:

    ```
    $ yarn lint:fix
    ```
OR enable `eslint --fix` onSave config in your code editor config.

### Useful docker command
- To rebuild the docker images:
    ```
    $ docker-compose up --force-recreate --build
    ```
- To enter inside docker container environment:
    ```
    $ docker-compose exec web sh
    ```
- Remove docker container if needed:
    ```
    $ docker rm -f varaamo-frontend
    ```
- Remove docker image:
    ```
    $ docker rmi varaamo_web
    ```
- Running command inside Docker environment (test for example):
(Make sure docker container is running)
    ```
    $ docker-compose run web YOUR_COMMAND_HERE
    ```
- Encounter `node-sass` issue ? try to go inside docker container environment and run `npm rebuild node-sass`

Code style and linting
----------------------

The code mostly follows the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
All JavaScript should be written in ES2015 syntax.
Code is automatically linted with [eslint](http://eslint.org/) when running unit tests or bundling the app with webpack.

Styles and Stylesheets
----------------------

[Sass](http://sass-lang.com/) CSS extension language is used to make writing styles nicer. [Autoprefixer](https://github.com/postcss/autoprefixer) handles CSS vendor prefixes.
[Bootstrap](http://getbootstrap.com/) is used as the CSS framework for the site and [City of Helsinki Bootstrap theme](https://github.com/City-of-Helsinki/hel-bootstrap-3) is used as the main theme.

Testing framework
-----------------

- [Jest](https://jestjs.io/) is used for running the tests and for test assertions. Running on [Jsdom](https://github.com/jsdom/jsdom) environment by default, which was a headless browser.
- [simple-mock](https://github.com/jupiter/simple-mock) and [MockDate](https://github.com/boblauer/MockDate) are used for mocking and spies.
- [Enzyme](https://github.com/airbnb/enzyme) is used to make testing React Components easier.

Running Vscode debugger
----------------------

All setting was included under .vscode directory.

- On Chrome:
    [Guideline](https://code.visualstudio.com/blogs/2016/02/23/introducing-chrome-debugger-for-vs-code). Setting was under `Vscode debugger` name
- On Jest test:
    [Guideline](https://jestjs.io/docs/en/troubleshooting#debugging-in-vs-code). Setting was under `Vscode Jest debugger` name.

    - Put breakpoint in test file `(*.test.js)`

    - Run command:

    ```
    $ yarn test:debug
    ```

License
-------

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2015 City of Helsinki <[http://www.hel.fi/](http://www.hel.fi/)>
