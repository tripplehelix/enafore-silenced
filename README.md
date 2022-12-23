# easrng/pinafore

My fork of [Pinafore](https://github.com/nolanlawson/pinafore), an alternative web client for [Mastodon](https://joinmastodon.org) focused on speed and simplicity.

easrng/pinafore is available at [pinafore.easrng.net](https://pinafore.easrng.net).

See the [user guide](https://github.com/easrng/pinafore/blob/master/docs/User-Guide.md) for basic usage. See the [admin guide](https://github.com/easrng/pinafore/blob/master/docs/Admin-Guide.md) if Pinafore cannot connect to your instance.

For updates, uhhhhhhhhh idk just follow me, I usually post when I fix or add things: [@easrng@cathode.church](https://cathode.church/@easrng).

## Browser support

Pinafore supports the latest versions of the following browsers:

- Chrome
- Edge
- Firefox
- Safari

Compatible versions of each (Opera, Brave, Samsung, etc.) should be fine.

## Goals and non-goals

### Goals

- Support the most common use cases
- Small page weight
- Fast even on low-end devices
- Accessibility
- Offline support in read-only mode
- Progressive Web App features
- Multi-instance support
- Support latest versions of Chrome, Edge, Firefox, and Safari
- Support features not included in vanilla Mastodon, like post formatting.
- Internationalization (I'm not doing a great job with this rn...)
- Emoji support beyond the built-in system emoji (Currently using Noto Color Emoji when system emojis aren't available)

### Non-goals

- Supporting old browsers, proxy browsers, or text-based browsers
- React Native / NativeScript / hybrid-native version
- Android/iOS apps (using Cordova or similar)
- Full functionality with JavaScript disabled
- Multi-column support
- Admin/moderation panel
- Offline support in read-write mode (would require sophisticated sync logic)

## Building

Pinafore requires [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com).

To build Pinafore for production, first install dependencies:

    yarn --production --pure-lockfile

Then build:

    yarn build

Then run:

    PORT=4002 node server.js

### Docker

To build a Docker image for production:

    docker build .
    docker run -d -p 4002:4002 [your-image]

Now Pinafore is running at `localhost:4002`.

### docker-compose

Alternatively, use docker-compose to build and serve the image for production:

    docker-compose up --build -d

The image will build and start, then detach from the terminal running at `localhost:4002`.

### Updating

To keep your version of Pinafore up to date, you can use `git` to check out the latest tag:

    git checkout $(git tag -l | sort -Vr | head -n 1)

### Exporting

Pinafore is a static site. When you run `yarn build`, static files will be
written to `__sapper__/export`.

~~It is _not_ recommended to directly expose these files when self-hosting. Instead, you should use `node server.js` (e.g. with an nginx or Apache proxy in front). This adds several things you don't get from the raw static files:~~

- ~~[CSP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) (important for security)~~
- ~~Certain dynamic routes (less important because of Service Worker managing routing, but certain things could break if Service Workers are disabled in the user's browser)~~

lol fuck that I use GitHub Pages

## Developing and testing

See [CONTRIBUTING.md](https://github.com/easrng/pinafore/blob/master/CONTRIBUTING.md) for
how to run Pinafore in dev mode and run tests.

## Changelog

I don't have an updated changelog.

## What's with the name?

easrng/pinafore means "pinafore forked by easrng"
