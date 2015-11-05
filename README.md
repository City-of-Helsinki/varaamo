Respa-ui
========

[![Circle CI](https://circleci.com/gh/fastmonkeys/respa-ui.svg?style=svg)](https://circleci.com/gh/fastmonkeys/respa-ui)

UI for a resource reservation system built for city of Helsinki. Uses the [respa API](http://api.hel.fi/respa/v1/).

Requirements
------------

- [node](http://nodejs.org/) `^0.12.7`
- [npm](https://www.npmjs.com/) `^2.11.3`

Development
-----------

Follow the instructions below to set up the development environment.

1. Install npm dependencies:

    ```
    $ npm install
    ```

2. Then, start the development server:

    ```
    $ npm start
    ```

Production
----------

Follow the instructions below to build and start production server.

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

Testing
-------

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
