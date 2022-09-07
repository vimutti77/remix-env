export const createEnv = ({
  filterEnv,
}: { filterEnv?: (key: string, value?: string) => boolean } = {}) => {
  const filteredEnvEntries = Object.entries(process.env).filter(
    ([key, value]) => {
      if (filterEnv) return filterEnv(key, value);
      return key.startsWith("PUBLIC_ENV_");
    }
  );

  const stringifyEnv = JSON.stringify({
    NODE_ENV: process.env.NODE_ENV,
    ...Object.fromEntries(filteredEnvEntries),
  });

  const encodedEnv = Buffer.from(stringifyEnv).toString("base64");
  return encodedEnv;
};

export const injectEnv = (html: string, env: string) => {
  const envScript = `<script>window.process={env:JSON.parse(atob("${env}"))}</script>`;
  const htmlWithEnv = html.replace("</head>", `${envScript}</head>`);
  return htmlWithEnv;
};
