# remix-env
Easy way to use process.env in your Remix apps

## Setup

1. Run `npm install remix-env` or `yarn add remix-env`
2. Add `EnvProvider` in `entry.client.tsx` and `entry.server.tsx`
#### entry.client.tsx
```diff
startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
+     <EnvProvider>
        <RemixBrowser />
+     </EnvProvider>
    </StrictMode>
  );
});
```
#### entry.server.tsx
```diff
export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = renderToString(
+   <EnvProvider>
      <RemixServer context={remixContext} url={request.url} />
+   </EnvProvider>
  );
}
```
3. Add `InjectEnv` in `root.tsx`
#### root.tsx
```diff
export function Root() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
+       <InjectEnv />
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
```

## Usage

Now, You can use the `getEnv` to get your env
```tsx
const env = getEnv()

// app/routes/_index.tsx
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

But you can customize it by provide the filter function at `EnvProvider`.

```tsx
<EnvProvider filter={(key, value) => key.startsWith("PUBLIC_ENV_")}>
  ...
</EnvProvider>
```
