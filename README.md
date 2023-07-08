# easrng/pinafore

My fork of [Pinafore](https://github.com/nolanlawson/pinafore), an alternative web client for [Mastodon](https://joinmastodon.org) focused on speed and simplicity.

easrng/pinafore is available at [pinafore.easrng.net](https://pinafore.easrng.net).

See the [user guide](https://github.com/easrng/pinafore/blob/main/docs/User-Guide.md) for basic usage. See the [admin guide](https://github.com/easrng/pinafore/blob/main/docs/Admin-Guide.md) if Pinafore cannot connect to your instance.

For updates, uhhhhhhhhh idk just follow me, I usually post when I fix or add things: [@easrng@cathode.church](https://cathode.church/@easrng).

## Browser support

I only test on Firefox on desktop and Chromium on Android.

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