declare global {
  var APP_ENV: Record<string, string>;
}

export function createEnv({
  filterEnv,
}: { filterEnv?: (key: string, value?: string) => boolean } = {}) {
  const filteredEnvEntries = Object.entries(process.env).filter(
    ([key, value]) => {
      if (filterEnv) return filterEnv(key, value);
      return key.startsWith("PUBLIC_ENV_");
    }
  );

  return {
    NODE_ENV: process.env.NODE_ENV,
    ...Object.fromEntries(filteredEnvEntries),
  };
}

export function injectEnv(html: string, env: Record<string, string>) {
  globalThis["APP_ENV"] = env;
  const stringifyEnv = JSON.stringify(env);
  const encodedEnv = Buffer.from(stringifyEnv).toString("base64");
  const envScript = `<script>window['APP_ENV']=JSON.parse(atob("${encodedEnv}"))</script>`;
  const htmlWithEnv = html.replace("</head>", `${envScript}</head>`);
  return htmlWithEnv;
}

export function getEnv() {
  return globalThis["APP_ENV"];
}
