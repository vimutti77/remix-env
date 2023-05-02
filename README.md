# remix-env
Easy way to use process.env in your Remix apps

## Setup

### `app/entry.server.tsx`
1. Run `npm install remix-env` or `yarn add remix-env`
2. Add `createEnv` before `handleRequest`
3. Using `injectEnv` to `markup`
4. Replace the reponse with the result from `injectEnv`

```diff
import { renderToString } from "react-dom/server";
import type {
  EntryContext,
  HandleDataRequestFunction,
} from "@remix-run/node"; // or cloudflare/deno
import { RemixServer } from "@remix-run/react";
+ import { createEnv, injectEnv } from 'remix-env'

+ const publicEnv = createEnv()

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

+   const markUpWithEnv = injectEnv(markup, publicEnv)

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
