import { ReactNode, createContext, useContext, useMemo } from "react";

declare global {
  interface Window {
    APP_ENV: Env;
  }
}

type Env = Record<string, string | undefined>;

const EnvContext = createContext<Env>({});

export type EnvProviderProps = {
  children?: ReactNode;
  filter?: (key: string, value?: string) => boolean;
};

export const EnvProvider = ({ children, filter }: EnvProviderProps) => {
  const publicEnv = useMemo(() => {
    const env = getEnv();
    const filteredEnvEntries = Object.entries(env).filter(
      ([key, value]) => filter?.(key, value) ?? key.startsWith("PUBLIC_ENV_")
    );

    return {
      NODE_ENV: env.NODE_ENV,
      ...Object.fromEntries(filteredEnvEntries),
    };
  }, [filter]);

  return (
    <EnvContext.Provider value={publicEnv}>{children}</EnvContext.Provider>
  );
};

export function useEnv() {
  return useContext(EnvContext);
}

export const InjectEnv = () => {
  const env = useEnv();
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window['APP_ENV']=${JSON.stringify(env)}`,
      }}
    />
  );
};

export function getEnv() {
  return typeof window === "undefined" ? process.env : window["APP_ENV"];
}
