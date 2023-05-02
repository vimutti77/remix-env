declare global {
  var APP_ENV: Env;
}

type Env = Record<string, string | undefined>;

export function setUpEnv() {
  globalThis["APP_ENV"] = process.env;
}

export function getEnv() {
  return globalThis["APP_ENV"];
}

export function injectEnv(
  html: string,
  filterPublicEnv?: (key: string, value?: string) => boolean
) {
  const env = getEnv();
  const filteredEnvEntries = Object.entries(env).filter(
    ([key, value]) =>
      filterPublicEnv?.(key, value) ?? key.startsWith("PUBLIC_ENV_")
  );

  const stringifyEnv = JSON.stringify(Object.fromEntries(filteredEnvEntries));
  const encodedEnv = Buffer.from(stringifyEnv).toString("base64");
  const envScript = `<script>window['APP_ENV']=JSON.parse(atob("${encodedEnv}"))</script>`;
  const htmlWithEnv = html.replace("</head>", `${envScript}</head>`);
  return htmlWithEnv;
}
