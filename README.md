# remix-env
Easy way to use process.env in your Remix apps

## Setup

### `app/entry.server.tsx`
1. Run `npm install remix-env` or `yarn add remix-env`
2. Add `setupEnv` in `remix.config.js`
3. Using `injectEnv` to `markup` in `entry.server.tsx`

#### remix.config.js
```diff
+ const { setUpEnv } = require('remix-env')

+ setUpEnv()
/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  // any configa
}

```


#### entry.server.tsx
```diff
import { renderToString } from "react-dom/server";
import type {
  EntryContext,
  HandleDataRequestFunction,
} from "@remix-run/node"; // or cloudflare/deno
import { RemixServer } from "@remix-run/react";
+ import { injectEnv } from 'remix-env'

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

+   const markUpWithEnv = injectEnv(markup)

  responseHeaders.set("Content-Type", "text/html");

-  return new Response("<!DOCTYPE html>" + markUp, {
+  return new Response("<!DOCTYPE html>" + markUpWithEnv, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
```

## Usage

Now, You can use the `getEnv` to get your env
```tsx
const env = getEnv()

// app/routes/index.tsx
export default function IndexRoute() {
  return (
    <div>
      {env.PUBLIC_ENV_FOO}
    </div>
  );
}
```

## Configuration

By default this library will inject all environment variables with prefix `PUBLIC_ENV_` to the browser.

But you can customize it by provide the filter function at `createEnv`.

```typescript
const publicEnv = createEnv({ filterEnv: (key, value) => {
  // Only env that starts with PUBLIC_ENV_
  return key.startsWith("PUBLIC_ENV_");
})
```
