# Contributing to Enafore

## Building

Enafore requires [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com).

To build Enafore for production, first install dependencies:

    yarn --production --pure-lockfile

Then build:

    yarn build

Then run:

    PORT=4002 node server.js

### Exporting

Enafore is a static site. When you run `yarn build`, static files will be
written to `__sapper__/export`.

## Installing

To install with dev dependencies, run:

    yarn

## Dev server

To run a dev server with hot reloading:

    yarn run dev

Now it's running at `localhost:4002`.

**Linux users:** for file changes to work,
you'll probably want to run `export CHOKIDAR_USEPOLLING=1`
because of [this issue](https://github.com/paulmillr/chokidar/issues/237).

## Linting

Enafore uses [JavaScript Standard Style](https://standardjs.com/).

Lint:

    yarn run lint

Automatically fix most linting issues:

    yarn run lint-fix

## Tests

lol, lmao

## Debug build

To disable minification in a production build (for debugging purposes), you can run:

    DEBUG=1 yarn build

## Debugging Webpack

The Webpack Bundle Analyzer `report.html` and `stats.json` are available publicly via e.g.:

- https://enafore.social/client/report.html
- https://enafore.social/client/stats.json

This is also available locally after `yarn run build` at `.sapper/client/report.html`.

## Architecture

See [Architecture.md](https://github.com/easrng/enafore/blob/main/docs/Architecture.md).

## Internationalization

See [Internationalization.md](https://github.com/easrng/enafore/blob/main/docs/Internationalization.md).

